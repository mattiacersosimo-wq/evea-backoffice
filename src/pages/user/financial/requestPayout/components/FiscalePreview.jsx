import { Alert, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axiosInstance from "src/utils/axios";

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
      text: "Attenzione: hai gi\u00E0 percepito \u20AC" + totale.toFixed(2) + " su \u20AC6.410 lordi annui. Superata la soglia, l'aliquota INPS aumenta significativamente.",
    };
  return {
    severity: "error",
    text: "Hai superato la soglia annua di \u20AC6.410. Valuta seriamente l'apertura di una Partita IVA o regime forfettario. L'aliquota INPS \u00E8 ora al 25.72%.",
  };
};

const FiscalePreview = () => {
  const { control } = useFormContext();
  const amount = useWatch({ control, name: "amount" });
  const [regimeFiscale, setRegimeFiscale] = useState("incaricato_occasionale");
  const [totaleLordo, setTotaleLordo] = useState(0);
  const [hasTotaleData, setHasTotaleData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    var fetchProfile = async () => {
      try {
        var res = await axiosInstance.get("api/profile");
        if (!cancelled) {
          var user = res.data?.data?.user;
          var profile = user?.user_profile;
          var regime = user?.regime_fiscale
            || profile?.regime_fiscale
            || "";
          console.log("[FiscalePreview] API user:", user);
          console.log("[FiscalePreview] API user_profile:", profile);
          console.log("[FiscalePreview] regime_fiscale raw value:", JSON.stringify(regime));
          var normalized = (regime || "").trim().toLowerCase();
          console.log("[FiscalePreview] regime_fiscale normalized:", JSON.stringify(normalized));
          if (normalized === "partita_iva" || normalized === "partita iva") {
            setRegimeFiscale("partita_iva");
          } else {
            setRegimeFiscale(normalized || "incaricato_occasionale");
          }
        }
      } catch (err) {
        console.error("[FiscalePreview] profile fetch error:", err);
        if (!cancelled) {
          setRegimeFiscale("incaricato_occasionale");
        }
      }
    };

    var fetchTotale = async () => {
      try {
        var res = await axiosInstance.get("api/wp/payout/totale-annuo");
        if (!cancelled) {
          var parsed = parseFloat(res.data?.data?.totale_lordo) || 0;
          setTotaleLordo(parsed);
          setHasTotaleData(true);
        }
      } catch (err) {
        if (!cancelled) {
          setTotaleLordo(0);
          setHasTotaleData(false);
        }
      }
    };

    fetchProfile();
    fetchTotale();

    return () => { cancelled = true; };
  }, []);

  if (regimeFiscale === "partita_iva") {
    return (
      <Box
        sx={{
          backgroundColor: "#FAF6EF",
          border: "1px solid #E8DDCA",
          borderRadius: 2,
          p: 2,
          mt: 1,
        }}
      >
        <Typography variant="body2" sx={{ color: "#B8963B", fontWeight: 600 }}>
          Hai Partita IVA — riceverai l'importo lordo e gestirai tu la fiscalit&agrave;
        </Typography>
      </Box>
    );
  }

  const parsed = parseFloat(amount) || 0;
  if (parsed <= 0) return null;

  const overThreshold = totaleLordo > SOGLIA_INPS;
  const inpsRate = overThreshold ? 0.2572 : 0.0919;

  const imponibile = parsed * 0.78;
  const ritenuta = imponibile * 0.23;
  const inps = imponibile * inpsRate * 0.333;
  const bollo = parsed >= 100 ? 2 : 0;
  const netto = parsed - ritenuta - inps - bollo;

  const alert = hasTotaleData ? getThresholdAlert(totaleLordo) : null;

  const rows = [
    { label: "Imponibile (78%)", value: imponibile },
    { label: "Ritenuta d'acconto (23%)", value: -ritenuta, deduction: true },
    {
      label: "INPS quota promoter (" + (inpsRate * 100).toFixed(2) + "%)",
      value: -inps,
      deduction: true,
    },
    { label: "Bollo", value: -bollo, deduction: true },
    { label: "Netto stimato", value: netto, highlight: true },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FAF6EF",
        border: "1px solid #E8DDCA",
        borderRadius: 2,
        p: 2,
        mt: 1,
      }}
    >
      {alert && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.text}
        </Alert>
      )}

      {rows.map(({ label, value, deduction, highlight }) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
            ...(highlight && {
              borderTop: "1px solid #E8DDCA",
              mt: 0.5,
              pt: 1,
            }),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: highlight ? 700 : 400,
              color: highlight ? "#B8963B" : "text.primary",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: highlight ? 700 : 400,
              color: deduction ? "#C0392B" : highlight ? "#B8963B" : "text.primary",
            }}
          >
            {deduction ? "\u2212" : ""}{"\u20AC"}{Math.abs(value).toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "text.secondary" }}>
        Le ritenute vengono versate da EVEA all'Agenzia delle Entrate per tuo conto.
      </Typography>
    </Box>
  );
};

export default FiscalePreview;
