import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { COMMUNITY_URL } from "src/config";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const CommunityRedirect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);
  const triedRef = useRef(false);

  // Quando la community si apre con successo in nuova scheda, riportiamo
  // l'utente alla pagina del backoffice da cui è arrivato — così il tab
  // corrente non resta sulla landing intermedia.
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/user/dashboard");
    }
  };

  // Apre la community in una nuova scheda usando SSO. Pre-apre about:blank
  // per evitare il popup blocker quando viene chiamata da un click utente.
  const openCommunity = async (preOpenedWin = null) => {
    const win = preOpenedWin || window.open("about:blank", "_blank");
    try {
      const { data } = await axiosInstance.get("api/community/sso");
      const url = data?.url || COMMUNITY_URL;
      if (win && !win.closed) {
        win.opener = null;
        win.location.href = url;
        setOpened(true);
        goBack();
      } else {
        // popup bloccato: mostro il bottone fallback (user-initiated)
        setError(true);
      }
    } catch (e) {
      if (win && !win.closed) {
        win.opener = null;
        win.location.href = COMMUNITY_URL;
        setOpened(true);
        goBack();
      } else {
        setError(true);
      }
    }
  };

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;
    openCommunity();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
        px: 2,
        textAlign: "center",
      }}
    >
      {!opened && !error && <CircularProgress sx={{ color: ORO }} />}
      <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: ESPRESSO }}>
        {t("community.title")}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: MUTED, maxWidth: 420 }}>
        {opened
          ? t("community.opened_message")
          : error
            ? t("community.blocked_message")
            : t("community.opening_message")}
      </Typography>
      {(opened || error) && (
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => openCommunity()}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700 }}
          >
            {t("community.open_community")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/user/dashboard")}
            sx={{ borderColor: ORO, color: ORO }}
          >
            {t("community.back_to_dashboard")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommunityRedirect;
