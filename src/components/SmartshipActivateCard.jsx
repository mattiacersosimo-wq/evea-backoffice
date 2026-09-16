import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Stack, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import fetchUser from "src/utils/fetchUser";
import { useSnackbar } from "notistack";
import { WP_URL } from "src/config";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const PRODUCTS = [
  { name: "Black Coffee", variant_id: "53545847095642" },
  { name: "Latte", variant_id: "53545846604122" },
  { name: "Mocha", variant_id: "53545846636890" },
  { name: "Green Tea Ganoderma", variant_id: "53545847292250" },
];

const SmartshipActivateCard = ({ renderTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Multi-select prodotti: array di indices selezionati
  const [selectedProducts, setSelectedProducts] = useState([0]);
  // Quantita' per prodotto: mappa { [idx]: number }
  const [quantities, setQuantities] = useState({ 0: 1 });
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const toggleProduct = (idx) => {
    setSelectedProducts((prev) => {
      if (prev.includes(idx)) {
        setQuantities((q) => {
          const next = { ...q };
          delete next[idx];
          return next;
        });
        return prev.filter((i) => i !== idx);
      }
      setQuantities((q) => ({ ...q, [idx]: q[idx] || 1 }));
      return [...prev, idx];
    });
  };

  const bumpQty = (idx, delta) => {
    setQuantities((q) => {
      const current = q[idx] || 1;
      const next = Math.max(1, Math.min(12, current + delta));
      return { ...q, [idx]: next };
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchUser.get("smartship/eligibility");
        setReason(data?.data?.reason || null);
      } catch (e) {
        // fallback: bottone come link a myevea.com
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      enqueueSnackbar("Seleziona almeno un prodotto.", { variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const products = selectedProducts.map((idx) => ({
        ...PRODUCTS[idx],
        qty: quantities[idx] || 1,
      }));
      const totalQty = products.reduce((sum, p) => sum + p.qty, 0);
      const { data } = await fetchUser.post("smartship/activate", {
        product_variant_id: products.map((p) => p.variant_id).join(","),
        product_name: products.map((p) => `${p.name} x${p.qty}`).join(" + "),
        frequency_days: 30,
        quantity: totalQty,
      });
      enqueueSnackbar(data?.data?.message || "Richiesta inviata.", { variant: "success" });
      setReason("request_pending");
      setDialogOpen(false);
    } catch (e) {
      const msg = e?.response?.data?.error || "Errore durante l'attivazione. Riprova.";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Se ha sub Seal attiva o richiesta pending non mostra nulla.
  // NON gattiamo su loading: mostriamo comunque il bottone come default
  // (link a myevea.com) durante il caricamento -> UX resiliente anche
  // se l'endpoint eligibility fallisce/e' lento.
  if (!loading && (reason === "smartship_already_active" || reason === "request_pending")) return null;

  // Se ha ordini pregressi -> apre dialog delayed +30gg (usa flag Seal).
  // Se NO ordini o loading -> link diretto a myevea.com (comportamento
  // originale, sempre funzionante).
  const useDialog = !loading && reason === null;
  const handleClick = () => useDialog
    ? setDialogOpen(true)
    : window.open(`${WP_URL.replace(/\/$/, "")}/collections/all`, "_blank");

  const trigger = renderTrigger
    ? renderTrigger({ onClick: handleClick, useDialog })
    : (
      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
        startIcon={<Iconify icon={useDialog ? "mdi:autorenew" : "mdi:storefront-outline"} />}
        sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 3 }}
      >
        Attiva smartship
      </Button>
    );

  return (
    <>
      {trigger}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Attiva SmartShip</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>
                Scegli i prodotti e le quantita
              </Typography>
              <Stack spacing={1}>
                {PRODUCTS.map((p, idx) => {
                  const active = selectedProducts.includes(idx);
                  const qty = quantities[idx] || 1;
                  return (
                    <Box
                      key={p.variant_id}
                      sx={{
                        p: 1.25, borderRadius: 2,
                        border: `2px solid ${active ? ORO : "#e5dcc9"}`,
                        bgcolor: active ? alpha(ORO, 0.08) : "#fff",
                        display: "flex", alignItems: "center", gap: 1.25,
                        transition: "all 0.15s",
                      }}
                    >
                      <Box
                        onClick={() => toggleProduct(idx)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.25,
                          cursor: "pointer", flex: 1, minWidth: 0,
                        }}
                      >
                        <Box sx={{
                          width: 22, height: 22, borderRadius: "50%",
                          border: `2px solid ${active ? ORO : "#c9c0ad"}`,
                          bgcolor: active ? ORO : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {active && <Iconify icon="mdi:check" width={14} sx={{ color: "#fff" }} />}
                        </Box>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: ESPRESSO }}>
                          {p.name}
                        </Typography>
                      </Box>

                      {active && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                          <IconButton
                            size="small"
                            onClick={() => bumpQty(idx, -1)}
                            disabled={qty <= 1}
                            sx={{ border: `1px solid ${alpha(ORO, 0.3)}`, width: 26, height: 26, borderRadius: 1 }}
                          >
                            <Iconify icon="mdi:minus" width={14} sx={{ color: ORO }} />
                          </IconButton>
                          <Typography sx={{ minWidth: 22, textAlign: "center", fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>
                            {qty}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => bumpQty(idx, 1)}
                            disabled={qty >= 12}
                            sx={{ border: `1px solid ${alpha(ORO, 0.3)}`, width: 26, height: 26, borderRadius: 1 }}
                          >
                            <Iconify icon="mdi:plus" width={14} sx={{ color: ORO }} />
                          </IconButton>
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{
              p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.06),
              border: `1px solid ${alpha(ORO, 0.2)}`,
            }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#6B5E54", lineHeight: 1.5 }}>
                <b>Frequenza:</b> ogni 30 giorni.<br />
                <b>Prima consegna:</b> tra 30 giorni dalla conferma.<br />
                <b>Prezzo:</b> €26,73/busta (invece di €29,70) con -10% SmartShip.<br />
                <b>Cancellazione:</b> puoi disattivare in qualsiasi momento.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>Annulla</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700 }}
          >
            {submitting ? "Invio..." : "Conferma"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SmartshipActivateCard;
