import { Card, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";

const MarketingPreferences = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [image, setImage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axiosInstance.get("api/wp/me/consents");
        if (!alive) return;
        setMarketing(Boolean(data.marketing_consent));
        setImage(Boolean(data.consent_image));
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.error || "Impossibile caricare i consensi.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const update = async (field, value) => {
    setSaving(true);
    const prevM = marketing;
    const prevI = image;
    if (field === "marketing_consent") setMarketing(value);
    if (field === "consent_image") setImage(value);
    try {
      await axiosInstance.post("api/wp/me/consents", { [field]: value });
      enqueueSnackbar("Preferenze aggiornate", { variant: "success" });
    } catch (e) {
      if (field === "marketing_consent") setMarketing(prevM);
      if (field === "consent_image") setImage(prevI);
      enqueueSnackbar(e?.response?.data?.error || "Errore aggiornamento", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={1}>
        Consensi e Comunicazioni
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
        Puoi modificare in qualsiasi momento i consensi facoltativi rilasciati al momento della firma della Lettera di Incarico.
      </Typography>

      {error && (
        <Typography variant="caption" color="error.main">{error}</Typography>
      )}

      {!error && (
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                disabled={loading || saving}
                checked={marketing}
                onChange={(e) => update("marketing_consent", e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.9rem" }}>
                Ricezione comunicazioni di marketing e newsletter
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Switch
                disabled={loading || saving}
                checked={image}
                onChange={(e) => update("consent_image", e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.9rem" }}>
                Utilizzo della mia immagine/voce per finalita' promozionali
              </Typography>
            }
          />
        </Stack>
      )}
    </Card>
  );
};

export default MarketingPreferences;
