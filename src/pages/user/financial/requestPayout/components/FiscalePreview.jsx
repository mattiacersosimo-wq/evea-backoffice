import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import useAuth from "src/hooks/useAuth";

const SOGLIA_INPS = 6410;

const getThresholdAlert = (totale) => {
  if (totale < 5000) return null;
  if (totale <= 6000)
    return {
      severity: "info",
      text: "Hai gi\u00E0 percepito \u20AC" + totale.toFixed(2) + " lordi quest'anno. Ti stai avvicinando alla soglia INPS di \u20AC6.410.",
    };
  if (totale <= SOGLIA_INPS)
    return {
      severity: "warning",
      text: "Attenzione: hai gi\u00E0 percepito \u20AC" + totale.toFixed(2) + " su \u20AC6.410 lordi annui. Superata la soglia, scattano i contributi INPS.",
    };
  return {
    severity: "error",
    text: "Hai superato la soglia annua di \u20AC6.410. I contributi INPS si applicano sull'eccedenza. Valuta l'apertura di Partita IVA.",
  };
};

const FiscalePreview = () => {
  const { control } = useFormContext();
  const { user } = useAuth();
  const amount = useWatch({ control, name: "amount" });
  const [calcolo, setCalcolo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totaleLordo, setTotaleLordo] = useState(0);
  const [hasTotaleData, setHasTotaleData] = useState(false);
  const debounceRef = useRef(null);

  const isPartitaIva = (user?.regime_fiscale || "").toLowerCase() === "partita_iva";

  // Fetch totale annuo once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get("api/wp/payout/totale-annuo");
        if (!cancelled) {
          setTotaleLordo(parseFloat(res.data?.data?.totale_lordo) || 0);
          setHasTotaleData(true);
        }
      } catch { if (!cancelled) setHasTotaleData(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Call backend /payout/calcola on amount change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const parsed = parseFloat(amount) || 0;
    if (parsed < 1 || isPartitaIva) {
      setCalcolo(null);
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
        }
      } catch {
        setCalcolo(null);
      }
      setLoading(false);
    }, 500);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amount, user?.id, isPartitaIva]);

  if (isPartitaIva) {
    return (
      <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1 }}>
        <Typography variant="body2" sx={{ color: "#B8963B", fontWeight: 600 }}>
          Hai Partita IVA — riceverai l'importo lordo e gestirai tu la fiscalit&agrave;
        </Typography>
      </Box>
    );
  }

  const parsed = parseFloat(amount) || 0;
  if (parsed <= 0) return null;

  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1, textAlign: "center" }}>
        <CircularProgress size={20} sx={{ color: "#B8963B" }} />
      </Box>
    );
  }

  if (!calcolo) return null;

  const alert = hasTotaleData ? getThresholdAlert(totaleLordo) : null;

  const rows = [
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

  return (
    <Box sx={{ backgroundColor: "#FAF6EF", border: "1px solid #E8DDCA", borderRadius: 2, p: 2, mt: 1 }}>
      {alert && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.text}</Alert>
      )}

      {rows.map(({ label, value, deduction, highlight, note }) => (
        <Box
          key={label}
          sx={{
            display: "flex", justifyContent: "space-between", py: 0.5,
            ...(highlight && { borderTop: "1px solid #E8DDCA", mt: 0.5, pt: 1 }),
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: highlight ? 700 : 400, color: highlight ? "#B8963B" : "text.primary" }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{
            fontWeight: highlight ? 700 : 400,
            color: note ? "text.secondary" : deduction ? "#C0392B" : highlight ? "#B8963B" : "text.primary",
            fontStyle: note ? "italic" : "normal",
          }}>
            {note || ((deduction ? "\u2212" : "") + "\u20AC" + Math.abs(value).toFixed(2))}
          </Typography>
        </Box>
      ))}

      {calcolo.soglia_inps_superata && (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#E65100", fontWeight: 600 }}>
          Soglia INPS superata — contributi applicati sull'eccedenza
        </Typography>
      )}

      <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
        Le ritenute vengono versate da EVEA all'Agenzia delle Entrate per tuo conto.
        Operazione fuori campo IVA ai sensi dell'art. 74, comma 1, lett. c) del DPR 633/72.
      </Typography>
    </Box>
  );
};

export default FiscalePreview;
