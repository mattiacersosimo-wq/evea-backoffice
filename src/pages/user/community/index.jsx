import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const CommunityRedirect = () => {
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const [error, setError] = useState(false);

  useEffect(() => {
    const go = async () => {
      try {
        const { data } = await axiosInstance.get("api/community/sso");
        window.location.href = data?.url || "https://community.myevea.com";
      } catch (e) {
        setError(true);
        setTimeout(() => {
          window.location.href = "https://community.myevea.com";
        }, 1500);
      }
    };
    go();
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
      <CircularProgress sx={{ color: ORO }} />
      <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: ESPRESSO }}>
        {isIt ? "Community EVEA" : "EVEA Community"}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: MUTED }}>
        {error
          ? isIt ? "Accesso diretto in corso..." : "Redirecting to community..."
          : isIt ? "Ti stiamo collegando alla community..." : "Connecting to community..."}
      </Typography>
    </Box>
  );
};

export default CommunityRedirect;
