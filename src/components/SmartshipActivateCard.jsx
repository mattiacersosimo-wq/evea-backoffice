import { useEffect, useState } from "react";
import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Stack, TextField, Typography,
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

const SmartshipActivateCard = ({ variant = "card" }) => {
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productIdx, setProductIdx] = useState(0);
  const [frequency, setFrequency] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchUser.get("smartship/eligibility");
        setEligible(!!data?.data?.eligible);
        setReason(data?.data?.reason || null);
      } catch (e) {
        setEligible(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const p = PRODUCTS[productIdx];
      const { data } = await fetchUser.post("smartship/activate", {
        product_variant_id: p.variant_id,
        product_name: p.name,
        frequency_days: Number(frequency),
        quantity: Number(quantity),
      });
      enqueueSnackbar(data?.data?.message || "Richiesta inviata.", { variant: "success" });
      setEligible(false);
      setReason("request_pending");
      setDialogOpen(false);
    } catch (e) {
      const msg = e?.response?.data?.error || "Errore durante l'attivazione. Riprova.";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  // Se ha sub Seal attiva o richiesta pending non mostra nulla.
  if (reason === "smartship_already_active" || reason === "request_pending") return null;

  // Se non ha ordini pregressi -> fallback link Shopify per primo ordine
  // in modalita smartship (parte subito col discount).
  const isFallback = reason === "no_past_order";

  if (variant === "inline") {
    return (
      <>
        <Button
          variant="contained"
          size="large"
          onClick={() => isFallback ? window.open(`${WP_URL.replace(/\/$/, "")}/collections/all`, "_blank") : setDialogOpen(true)}
          startIcon={<Iconify icon={isFallback ? "mdi:storefront-outline" : "mdi:autorenew"} />}
          sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Attiva smartship
        </Button>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 800 }}>Attiva SmartShip</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                select fullWidth label="Prodotto"
                value={productIdx}
                onChange={(e) => setProductIdx(Number(e.target.value))}
              >
                {PRODUCTS.map((p, idx) => (
                  <MenuItem key={p.variant_id} value={idx}>{p.name}</MenuItem>
                ))}
              </TextField>

              <TextField
                select fullWidth label="Frequenza"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
              >
                <MenuItem value={30}>Ogni 30 giorni</MenuItem>
                <MenuItem value={60}>Ogni 60 giorni</MenuItem>
              </TextField>

              <TextField
                type="number" fullWidth label="Quantita per ordine"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                inputProps={{ min: 1, max: 12 }}
              />

              <Box sx={{
                p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.06),
                border: `1px solid ${alpha(ORO, 0.2)}`,
              }}>
                <Typography sx={{ fontSize: "0.78rem", color: "#6B5E54", lineHeight: 1.5 }}>
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
  }

  return (
    <>
      <Card sx={{
        borderRadius: 3, p: 2.5, mb: 2,
        border: `2px solid ${alpha(ORO, 0.35)}`,
        background: `linear-gradient(135deg, ${alpha(ORO, 0.06)} 0%, #fff 60%)`,
      }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 2,
            bgcolor: alpha(ORO, 0.12),
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Iconify icon="mdi:autorenew" width={32} sx={{ color: ORO }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: ESPRESSO }}>
                Attiva SmartShip
              </Typography>
              <Chip label="-10%" size="small" sx={{
                height: 20, fontSize: "0.65rem", fontWeight: 700,
                bgcolor: ORO, color: "#fff",
              }} />
            </Stack>
            <Typography sx={{ fontSize: "0.85rem", color: "#6B5E54", lineHeight: 1.5 }}>
              Ricevi il tuo prodotto preferito ogni mese con -10% di sconto.
              Non paghi oggi: la prima consegna parte tra 30 giorni.
              Cancelli quando vuoi.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" },
              textTransform: "none", fontWeight: 700, borderRadius: 2,
              px: 3, py: 1,
              flexShrink: 0,
            }}
          >
            Attiva ora
          </Button>
        </Stack>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Attiva SmartShip</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select fullWidth label="Prodotto"
              value={productIdx}
              onChange={(e) => setProductIdx(Number(e.target.value))}
            >
              {PRODUCTS.map((p, idx) => (
                <MenuItem key={p.variant_id} value={idx}>{p.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select fullWidth label="Frequenza"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
            >
              <MenuItem value={30}>Ogni 30 giorni</MenuItem>
              <MenuItem value={60}>Ogni 60 giorni</MenuItem>
            </TextField>

            <TextField
              type="number" fullWidth label="Quantita per ordine"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
              inputProps={{ min: 1, max: 12 }}
            />

            <Box sx={{
              p: 1.5, borderRadius: 2, bgcolor: alpha(ORO, 0.06),
              border: `1px solid ${alpha(ORO, 0.2)}`,
            }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#6B5E54", lineHeight: 1.5 }}>
                <b>Prima consegna:</b> tra 30 giorni dalla conferma.<br />
                <b>Prezzo:</b> €26,73/busta (invece di €29,70) con -10% SmartShip.<br />
                <b>Cancellazione:</b> puoi disattivare in qualsiasi momento dall'area cliente.
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
