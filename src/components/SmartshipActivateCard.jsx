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
  // Multi-select prodotti: array di indices selezionati
  const [selectedProducts, setSelectedProducts] = useState([0]);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const toggleProduct = (idx) => {
    setSelectedProducts((prev) => prev.includes(idx)
      ? prev.filter((i) => i !== idx)
      : [...prev, idx]);
  };

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
    if (selectedProducts.length === 0) {
      enqueueSnackbar("Seleziona almeno un prodotto.", { variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const products = selectedProducts.map((idx) => PRODUCTS[idx]);
      const { data } = await fetchUser.post("smartship/activate", {
        product_variant_id: products.map((p) => p.variant_id).join(","),
        product_name: products.map((p) => p.name).join(" + "),
        frequency_days: 30,
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

  // Se ha sub Seal attiva o richiesta pending non mostra nulla.
  // NON gattiamo su loading: mostriamo comunque il bottone come default
  // (link a myevea.com) durante il caricamento -> UX resiliente anche
  // se l'endpoint eligibility fallisce/e' lento. Se poi eligibility
  // arriva con smartship_already_active/request_pending, il bottone
  // scompare.
  if (!loading && (reason === "smartship_already_active" || reason === "request_pending")) return null;

  // Se ha ordini pregressi -> apre dialog delayed +30gg (usa flag Seal).
  // Se NO ordini o loading -> link diretto a myevea.com (comportamento
  // originale, sempre funzionante).
  const useDialog = !loading && reason === null; // eligible=true (ordini pregressi + no sub)

  if (variant === "inline") {
    return (
      <>
        <Button
          variant="contained"
          size="large"
          onClick={() => useDialog ? setDialogOpen(true) : window.open(`${WP_URL.replace(/\/$/, "")}/collections/all`, "_blank")}
          startIcon={<Iconify icon={useDialog ? "mdi:autorenew" : "mdi:storefront-outline"} />}
          sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Attiva smartship
        </Button>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 800 }}>Attiva SmartShip</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: ESPRESSO, mb: 1 }}>
                  Scegli i prodotti (uno o più)
                </Typography>
                <Stack spacing={1}>
                  {PRODUCTS.map((p, idx) => {
                    const active = selectedProducts.includes(idx);
                    return (
                      <Box
                        key={p.variant_id}
                        onClick={() => toggleProduct(idx)}
                        sx={{
                          p: 1.5, borderRadius: 2, cursor: "pointer",
                          border: `2px solid ${active ? ORO : "#e5dcc9"}`,
                          bgcolor: active ? alpha(ORO, 0.08) : "#fff",
                          display: "flex", alignItems: "center", gap: 1.5,
                          transition: "all 0.15s",
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
                    );
                  })}
                </Stack>
              </Box>

              <TextField
                type="number" fullWidth label="Quantita per prodotto"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                inputProps={{ min: 1, max: 12, inputMode: "numeric", autoComplete: "off" }}
                autoComplete="off"
              />

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
