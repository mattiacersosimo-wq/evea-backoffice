import { Alert, AlertTitle, Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";
import Iconify from "src/components/Iconify";

const SOGLIA_INPS = 6410.26;
const ORO = "#B8963B";

/**
 * Banner persistente che mostra al promoter (non-P.IVA) lo stato verso la soglia INPS €6.410,26.
 * - Sotto €5.000 → nascosto
 * - €5.000–6.000 → info (blu)
 * - €6.000–6.410,26 → warning (arancio) con CTA P.IVA
 * - ≥ €6.410,26 → error (rosso) con CTA P.IVA + messaggio blocco
 *
 * Stop a errori silenziosi: se l'endpoint fallisce o il regime è P.IVA, ritorna null.
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

  const totale = parseFloat(data.totale_lordo) || 0;
  const residuo = parseFloat(data.residuo_soglia ?? 0);
  if (totale < 5000) return null;

  const pct = Math.min(100, (totale / SOGLIA_INPS) * 100);
  const isBlocked = residuo <= 0;
  const isWarning = !isBlocked && totale >= 6000;
  const severity = isBlocked ? "error" : isWarning ? "warning" : "info";

  const title = isBlocked
    ? "Soglia INPS raggiunta"
    : isWarning
      ? "Stai per superare la soglia INPS"
      : "Avvicinamento soglia INPS";

  const body = isBlocked
    ? `Hai raggiunto €${totale.toFixed(2)} su €6.410,26 lordi annui. I prossimi payout senza P.IVA saranno bloccati: l'importo resterà nel wallet finché non apri Partita IVA.`
    : isWarning
      ? `Hai percepito €${totale.toFixed(2)} su €6.410,26 lordi annui. Residuo richiedibile senza P.IVA: €${residuo.toFixed(2)}. Oltre soglia scattano i contributi INPS.`
      : `Hai percepito €${totale.toFixed(2)} lordi quest'anno. Quando supererai €6.410,26 dovrai gestire la fiscalità tramite Partita IVA.`;

  return (
    <Alert severity={severity} icon={<Iconify icon="mdi:scale-balance" width={22} />} sx={{ mb: 2, borderRadius: 2 }}>
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1.2 }}>{body}</Typography>
      <Box sx={{ mb: 1 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>€{totale.toFixed(2)}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>€6.410,26</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 6, borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.06)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isBlocked ? "#C62828" : isWarning ? "#EF6C00" : ORO,
            },
          }}
        />
      </Box>
      {(isWarning || isBlocked) && (
        <Button
          size="small"
          variant="outlined"
          color={isBlocked ? "error" : "warning"}
          startIcon={<Iconify icon="mdi:file-document-edit-outline" />}
          href="https://www.agenziaentrate.gov.it/portale/web/guest/aprire-una-partita-iva"
          target="_blank"
          rel="noopener"
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Come aprire Partita IVA
        </Button>
      )}
    </Alert>
  );
}
