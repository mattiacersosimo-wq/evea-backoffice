import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";

const SOGLIA_INPS = 6410.26;

const getThresholdAlert = (maturato, residuo, t) => {
  if (maturato < 5000) return null;
  if (maturato <= 6000)
    return {
      severity: "info",
      text: t("financial.fiscale.approaching_threshold", { maturato: maturato.toFixed(2) }),
    };
  if (maturato < SOGLIA_INPS)
    return {
      severity: "warning",
      text: t("financial.fiscale.warning_threshold", { maturato: maturato.toFixed(2), residuo: (residuo || 0).toFixed(2) }),
    };
  return {
    severity: "error",
    text: t("financial.fiscale.threshold_exceeded", { maturato: maturato.toFixed(2) }),
  };
};

const FiscalePreview = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { user } = useAuth();
  const amount = useWatch({ control, name: "amount" });
  const [calcolo, setCalcolo] = useState(null);
  const [flusso, setFlusso] = useState(null); // 'ivd_abituale' | 'occasionale' (server-side)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [maturatoAnno, setMaturatoAnno] = useState(0);
  const [residuoSoglia, setResiduoSoglia] = useState(SOGLIA_INPS);
  const [hasTotaleData, setHasTotaleData] = useState(false);
  const debounceRef = useRef(null);

  // Fetch totale annuo once (solo per occasionali: il banner soglia INPS non si applica agli abituali)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get("api/wp/payout/totale-annuo");
        if (!cancelled) {
          const d = res.data?.data || {};
          setMaturatoAnno(parseFloat(d.maturato_anno ?? d.totale_lordo) || 0);
          const r = d.residuo_soglia;
          if (r !== null && r !== undefined) setResiduoSoglia(parseFloat(r));
          setHasTotaleData(true);
        }
      } catch { if (!cancelled) setHasTotaleData(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Call backend /payout/calcola on amount change (debounced).
  // Il backend ramifica server-side su has_piva_ivd: la response include 'flusso'
  // ('ivd_abituale' o 'occasionale') che usiamo come unico discriminante UI.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const parsed = parseFloat(amount) || 0;
    if (parsed < 1) {
      setCalcolo(null);
      setFlusso(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const form = new FormData();
        form.append("user_id", user?.id);
        form.append("lordo", parsed);
        const { data } = await axiosInstance.post("api/wp/payout/calcola", form);
        if (data?.successo) {
          setCalcolo(data.calcolo);
          setFlusso(data.flusso || (data.ha_partita_iva ? "ivd_abituale" : "occasionale"));
        }
      } catch (err) {
        setCalcolo(null);
        setFlusso(null);
        // Mostra il messaggio del backend (es. 422 KYC incompleto) invece di silenziare l'errore.
        const apiMsg = err?.response?.data?.error || err?.response?.data?.message;
        setErrorMsg(apiMsg || t("financial.fiscale.calc_error"));
      }
      setLoading(false);
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amount, user?.id]);

  const isAbituale = flusso === "ivd_abituale";
  const parsed = parseFloat(amount) || 0;

  // Banner sempre visibile (anche prima di digitare amount) se utente non-P.IVA si avvicina/supera soglia.
  // Si basa sul maturato annuo (commissioni in wallet), non solo sui prelievi.
  const baseAlert = hasTotaleData ? getThresholdAlert(maturatoAnno, residuoSoglia, t) : null;
  const willCap = parsed > 0 && residuoSoglia > 0 && parsed > residuoSoglia;
  const blockedTotal = hasTotaleData && residuoSoglia <= 0;

  if (parsed <= 0) {
    // Mostra solo il banner soglia se rilevante, altrimenti niente
    if (!baseAlert) return null;
    return (
      <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1 }}>
        <Alert severity={baseAlert.severity}>{baseAlert.text}</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1, textAlign: "center" }}>
        <CircularProgress size={20} sx={{ color: "#B8963B" }} />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1 }}>
        <Alert severity="error">{errorMsg}</Alert>
      </Box>
    );
  }

  if (!calcolo) return null;

  const alert = baseAlert;

  // \u2500\u2500 Ramo IVD-ABITUALE (has_piva_ivd=1, server-side) \u2500\u2500
  // Imponibile + IVA + ritenuta (+ eventuale INPS sopra soglia) -> netto bonifico.
  // Si mostra anche il "Totale da fatturare a EVEA" che e' il valore della fattura
  // che il promoter deve emettere.
  let rows;
  // Commissione amministrativa (NON fiscale): copre il costo SEPA del bonifico.
  // Backend la calcola in admin_fee e ritorna anche netto_bonifico = netto - admin_fee.
  const adminFee = parseFloat(calcolo.admin_fee) || 0;
  const nettoBonifico = (calcolo.netto_bonifico !== undefined && calcolo.netto_bonifico !== null)
    ? parseFloat(calcolo.netto_bonifico)
    : parseFloat(calcolo.netto) - adminFee;

  if (isAbituale) {
    // EVEA trattiene solo la ritenuta 23% sul 78% (art. 25-bis co.6 DPR 600/73).
    // INPS Gestione Separata gestita dal promoter sulla propria posizione
    // (e' professionista con P.IVA, conferma commercialista 2026-05-30).
    rows = [
      { label: t("financial.fiscale.imponibile"), value: calcolo.imponibile },
      { label: t("financial.fiscale.iva_22"), value: calcolo.iva, positive: true, prefix: "+" },
      { label: t("financial.fiscale.ritenuta_23_evea"), value: -calcolo.ritenuta, deduction: true },
      { label: t("financial.fiscale.totale_da_fatturare"), value: calcolo.esborso_evea, separator: true },
    ];
    if (adminFee > 0) {
      rows.push({ label: t("financial.fiscale.admin_fee_sepa"), value: -adminFee, deduction: true });
    }
    rows.push({ label: t("financial.fiscale.netto_bonifico_promoter"), value: nettoBonifico, highlight: true });
  } else {
    // \u2500\u2500 Ramo OCCASIONALE (has_piva_ivd=0) \u2500\u2500
    rows = [
      { label: t("financial.fiscale.imponibile"), value: calcolo.imponibile },
    ];

    if (calcolo.ritenuta > 0) {
      rows.push({ label: t("financial.fiscale.ritenuta_acconto_23"), value: -calcolo.ritenuta, deduction: true });
    } else {
      rows.push({ label: t("financial.fiscale.ritenuta_acconto"), value: 0, note: t("financial.fiscale.ritenuta_esente") });
    }

    if (calcolo.inps_quota_promoter > 0) {
      const aliqPct = calcolo.aliquota_inps ? (calcolo.aliquota_inps * 100).toFixed(2) + "%" : "";
      rows.push({ label: t("financial.fiscale.inps_quota_promoter", { aliq: aliqPct }), value: -calcolo.inps_quota_promoter, deduction: true });
    }

    if (calcolo.bollo > 0) {
      rows.push({ label: t("financial.fiscale.imposta_bollo"), value: -calcolo.bollo, deduction: true });
    }

    if (adminFee > 0) {
      rows.push({ label: t("financial.fiscale.admin_fee_sepa"), value: -adminFee, deduction: true });
    }

    rows.push({ label: t("financial.fiscale.netto_accreditato"), value: nettoBonifico, highlight: true });
  }

  return (
    <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1 }}>
      {/* Banner soglia INPS visibile solo per occasionali. Per gli IVD abituali */}
      {/* la soglia non vale come blocco: la P.IVA c'e' gia'.                     */}
      {!isAbituale && alert && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.text}</Alert>
      )}

      {!isAbituale && blockedTotal && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("financial.fiscale.threshold_reached_open_piva")}
        </Alert>
      )}

      {!isAbituale && willCap && !blockedTotal && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>{t("financial.fiscale.auto_cap_label")}</strong> {t("financial.fiscale.auto_cap_text", { residuo: residuoSoglia.toFixed(2), remain: (parsed - residuoSoglia).toFixed(2) })}
        </Alert>
      )}

      {rows.map(({ label, value, deduction, highlight, note, positive, prefix, separator }) => (
        <Box
          key={label}
          sx={{
            display: "flex", justifyContent: "space-between", py: 0.5,
            ...(highlight && { borderTop: "1px solid #E8DDCA", mt: 0.5, pt: 1 }),
            ...(separator && { borderTop: "1px dashed #E8DDCA", mt: 0.5, pt: 0.8 }),
          }}
        >
          <Typography variant="body2" sx={{
            fontWeight: highlight ? 700 : (separator ? 600 : 400),
            color: highlight ? "#B8963B" : (separator ? "#2C1A0E" : "text.primary"),
          }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{
            fontWeight: highlight || separator ? 700 : 400,
            color: note ? "text.secondary"
              : deduction ? "#C0392B"
              : positive ? "#2C5F2D"
              : highlight ? "#B8963B"
              : separator ? "#2C1A0E"
              : "text.primary",
            fontStyle: note ? "italic" : "normal",
          }}>
            {note || ((deduction ? "\u2212" : (prefix || "")) + "\u20AC" + Math.abs(value).toFixed(2))}
          </Typography>
        </Box>
      ))}

      {calcolo.soglia_inps_superata && (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#E65100", fontWeight: 600 }}>
          {t("financial.fiscale.soglia_superata_note")}
        </Typography>
      )}

      {isAbituale ? (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          {t("financial.fiscale.footer_abituale_prefix")} <strong>KRRH6B9</strong>{t("financial.fiscale.footer_abituale_suffix")}
        </Typography>
      ) : (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          {t("financial.fiscale.footer_occasionale")}
        </Typography>
      )}
    </Box>
  );
};

export default FiscalePreview;
