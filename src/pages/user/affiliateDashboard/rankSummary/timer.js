import { Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import useTimer from "./hook/useTimer";

const Timer = ({ expiryDate }) => {
  const theme = useTheme();
  const { days, hours, minutes, seconds } = useTimer(expiryDate);
  const formatTime = (val) => String(val).padStart(2, "0");

  return (
    <Typography
      component="div"
      variant="subtitle2"
      sx={{
        mt: 1,
        color: "#2C1A0E",
        backgroundColor: "rgba(184, 150, 59, 0.1)",
        border: "1.5px solid #B8963B",
        borderRadius: "6px",
        padding: { xs: "4px 2px", sm: "5px" },
        fontWeight: 700,
        mb: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "nowrap",
        fontSize: { xs: "0.7rem", sm: "0.9rem" },
        letterSpacing: { xs: "-0.5px", sm: 0 },
        width: "100%",
        overflow: "hidden",
      }}
    >
      {`${formatTime(days)}d ${formatTime(hours)}h ${formatTime(
        minutes,
      )}m ${formatTime(seconds)}s`}
    </Typography>
  );
};

export default Timer;
