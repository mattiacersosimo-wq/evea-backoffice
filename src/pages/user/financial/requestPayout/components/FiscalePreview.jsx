import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";

const SOGLIA_INPS = 6410.26;

const getThresholdAlert = (maturato, residuo) => {
  if (maturato < 5000) return null;
  if (maturato <= 6000)
    return {
      severity: "info",
      text: "Hai maturato \u20AC" + maturato.toFixed(2) + " lordi quest'anno. Ti stai avvicinando alla soglia INPS di \u20AC6.410,26.",
    };
  if (maturato < SOGLIA_INPS)
    return {
      severity: "warning",
      text: "Attenzione: hai maturato \u20AC" + maturato.toFixed(2) + " su \u20AC6.410,26 lordi annui. Residuo richiedibile senza P.IVA: \u20AC" + (residuo || 0).toFixed(2) + ".",
    };
  return {
    severity: "error",
    text: "Hai superato la soglia annua di \u20AC6.410,26 (maturato \u20AC" + maturato.toFixed(2) + "). I prossimi prelievi senza P.IVA verranno cappati al residuo.",
  };
};

const FiscalePreview = () => {
  const { control } = useFormContext();
  const { user } = useAuth();
  const amount = useWatch({ control, name: "amount" });
  const [calcolo, setCalcolo] = useState(null);
  const [flusso, setFlusso] = useState(null); // 'ivd_abituale' | 'occasionale' (server-side)
  const [loading, setLoading] = useState(false);
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
      try {
        const form = new FormData();
        form.append("user_id", user?.id);
        form.append("lordo", parsed);
        const { data } = await axiosInstance.post("api/wp/payout/calcola", form);
        if (data?.successo) {
          setCalcolo(data.calcolo);
          setFlusso(data.flusso || (data.ha_partita_iva ? "ivd_abituale" : "occasionale"));
        }
      } catch {
        setCalcolo(null);
        setFlusso(null);
      }
      setLoading(false);
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amount, user?.id]);

  const isAbituale = flusso === "ivd_abituale";
  const parsed = parseFloat(amount) || 0;

  // Banner sempre visibile (anche prima di digitare amount) se utente non-P.IVA si avvicina/supera soglia.
  // Si basa sul maturato annuo (commissioni in wallet), non solo sui prelievi.
  const baseAlert = hasTotaleData ? getThresholdAlert(maturatoAnno, residuoSoglia) : null;
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

  if (!calcolo) return null;

  const alert = baseAlert;

  // \u2500\u2500 Ramo IVD-ABITUALE (has_piva_ivd=1, server-side) \u2500\u2500
  // Imponibile + IVA + ritenuta (+ eventuale INPS sopra soglia) -> netto bonifico.
  // Si mostra anche il "Totale da fatturare a EVEA" che e' il valore della fattura
  // che il promoter deve emettere.
  let rows;
  if (isAbituale) {
    // EVEA trattiene solo la ritenuta 23% sul 78% (art. 25-bis co.6 DPR 600/73).
    // INPS Gestione Separata gestita dal promoter sulla propria posizione
    // (e' professionista con P.IVA, conferma commercialista 2026-05-30).
    rows = [
      { label: "Imponibile (78%)", value: calcolo.imponibile },
      { label: "IVA 22%", value: calcolo.iva, positive: true, prefix: "+" },
      { label: "Ritenuta 23% (trattenuta EVEA)", value: -calcolo.ritenuta, deduction: true },
      { label: "Totale da fatturare a EVEA", value: calcolo.esborso_evea, separator: true },
      { label: "Netto bonifico al promoter", value: calcolo.netto, highlight: true },
    ];
  } else {
    // \u2500\u2500 Ramo OCCASIONALE (has_piva_ivd=0) \u2014 invariato rispetto a prima \u2500\u2500
    rows = [
      { label: "Imponibile (78%)", value: calcolo.imponibile },
    ];

    if (calcolo.ritenuta > 0) {
      rows.push({ label: "Ritenuta d'acconto (23%)", value: -calcolo.ritenuta, deduction: true });
    } else {
      rows.push({ label: "Ritenuta d'acconto", value: 0, note: "esente (< \u20AC25,82)" });
    }

    if (calcolo.inps_quota_promoter > 0) {
      const aliqPct = calcolo.aliquota_inps ? (calcolo.aliquota_inps * 100).toFixed(2) + "%" : "";
      rows.push({ label: `INPS quota promoter ${aliqPct ? "(" + aliqPct + " \u00D7 \u2153)" : ""}`, value: -calcolo.inps_quota_promoter, deduction: true });
    }

    if (calcolo.bollo > 0) {
      rows.push({ label: "Imposta di bollo", value: -calcolo.bollo, deduction: true });
    }

    rows.push({ label: "Netto accreditato", value: calcolo.netto, highlight: true });
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
          Hai raggiunto la soglia annua di €6.410,26. La richiesta verrà rifiutata: apri Partita IVA per ricevere altri payout.
        </Alert>
      )}

      {!isAbituale && willCap && !blockedTotal && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Cap automatico al residuo soglia:</strong> verrai pagato solo €{residuoSoglia.toFixed(2)} (residuo INPS). I restanti €{(parsed - residuoSoglia).toFixed(2)} resteranno nel wallet finché non apri Partita IVA.
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
          Soglia INPS superata — contributi applicati sull'eccedenza
        </Typography>
      )}

      {isAbituale ? (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          Riceverai il bonifico dopo aver emesso fattura elettronica verso EVEA Global S.r.l. (P.IVA 18499281006, codice destinatario SDI <strong>KRRH6B9</strong>, PEC fallback eveaglobal@pec.it). La ritenuta è versata da EVEA all'Agenzia delle Entrate per tuo conto.
        </Typography>
      ) : (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
          Le ritenute vengono versate da EVEA all'Agenzia delle Entrate per tuo conto.
          Operazione fuori campo IVA ai sensi dell'art. 25-bis co. 6 DPR 600/73.
        </Typography>
      )}
    </Box>
  );
};

export default FiscalePreview;
