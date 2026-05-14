import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const CommunityRedirect = () => {
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
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
      const url = data?.url || "https://community.myevea.com";
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
        win.location.href = "https://community.myevea.com";
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
        {isIt ? "Community EVEA" : "EVEA Community"}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: MUTED, maxWidth: 420 }}>
        {opened
          ? isIt
            ? "Community aperta in una nuova scheda. Se non la vedi, controlla che il browser non l'abbia bloccata."
            : "Community opened in a new tab. If you don't see it, check that your browser hasn't blocked it."
          : error
            ? isIt
              ? "Apertura automatica bloccata dal browser. Clicca sul pulsante qui sotto."
              : "Auto-open was blocked by the browser. Click the button below."
            : isIt
              ? "Stiamo aprendo la community in una nuova scheda..."
              : "Opening the community in a new tab..."}
      </Typography>
      {(opened || error) && (
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => openCommunity()}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700 }}
          >
            {isIt ? "Apri Community" : "Open Community"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/user/dashboard")}
            sx={{ borderColor: ORO, color: ORO }}
          >
            {isIt ? "Torna alla Dashboard" : "Back to Dashboard"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommunityRedirect;
