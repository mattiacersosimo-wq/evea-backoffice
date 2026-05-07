import { Alert, AlertTitle, Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import Iconify from "src/components/Iconify";

const SOGLIA_INPS = 6410.26;
const ORO = "#B8963B";

/**
 * Banner persistente che mostra al promoter (non-P.IVA) il maturato anno
 * verso la soglia INPS €6.410,26.
 *
 * Si basa sul *maturato* annuo (commissioni accreditate in wallet), non solo
 * sui prelievi richiesti — cosi avvisa anche chi tiene i guadagni nel wallet.
 *
 * - Sotto €5.000 → nascosto
 * - €5.000–6.000 → info
 * - €6.000–6.410,26 → warning
 * - ≥ €6.410,26 → error
 */
export default function FiscalThresholdBanner() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get("api/wp/payout/totale-annuo");
        if (!cancelled) setData(res.data?.data || null);
      } catch { /* silent */ }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!data) return null;
  if (data.ha_partita_iva) return null;

  const maturato = parseFloat(data.maturato_anno ?? data.totale_lordo) || 0;
  const prelevato = parseFloat(data.totale_lordo) || 0;
  if (maturato < 5000) return null;

  const pct = Math.min(100, (maturato / SOGLIA_INPS) * 100);
  const isOver = maturato >= SOGLIA_INPS;
  const isWarning = !isOver && maturato >= 6000;
  const severity = isOver ? "error" : isWarning ? "warning" : "info";

  const title = isOver
    ? "Soglia INPS superata"
    : isWarning
      ? "Stai per superare la soglia INPS"
      : "Avvicinamento soglia INPS";

  const body = isOver
    ? `Hai già maturato €${maturato.toFixed(2)} quest'anno (di cui €${prelevato.toFixed(2)} richiesti come prelievo). Oltre €6.410,26 lordi annui scatta l'obbligo di Partita IVA: i prossimi prelievi saranno bloccati e l'importo resterà nel wallet finché non apri P.IVA.`
    : isWarning
      ? `Hai maturato €${maturato.toFixed(2)} quest'anno su €6.410,26 lordi annui (di cui €${prelevato.toFixed(2)} richiesti). Quando preleverai oltre soglia dovrai aprire Partita IVA.`
      : `Hai maturato €${maturato.toFixed(2)} lordi quest'anno. Quando supererai €6.410,26 sarà necessario aprire Partita IVA per ricevere i prelievi.`;

  return (
    <Alert severity={severity} icon={<Iconify icon="mdi:scale-balance" width={22} />} sx={{ mb: 2, borderRadius: 2 }}>
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1.2 }}>{body}</Typography>
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>€{maturato.toFixed(2)}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>€6.410,26</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 6, borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.06)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isOver ? "#C62828" : isWarning ? "#EF6C00" : ORO,
            },
          }}
        />
      </Box>
    </Alert>
  );
}
