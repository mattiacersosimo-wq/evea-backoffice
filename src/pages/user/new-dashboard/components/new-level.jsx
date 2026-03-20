import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";

import Bronze from "src/images/bronze.png";
import NewLevelIcon from "src/images/rank-achieve.png";
import Silver from "src/images/silver.png";

const NewLevel = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();

  const rank = user?.rank;
  const rankStatus = user?.rankStatus;
  
  return (
    <Box
      sx={{
        pt: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "310px",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <img src={NewLevelIcon} style={{ width: "100px" }} alt="New Level" />
      </Box>

      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography
          sx={{ color: theme.palette.primary.main, fontSize: "15px" }}
        >
          {t("user_dashboard.nextlevelTitle")}
        </Typography>
        <Typography
          sx={{
            color: theme.palette.widgets.tertiary[400],
            fontSize: "13px",
            fontWeight: "300",
          }}
        >
          {t("user_dashboard.nextlevelSubTitle")}
        </Typography>
      </Box>


      <Box
        sx={{
          border: `1px solid ${theme.palette.widgets.border[300]}`,
          px: { xl: 3, xs: 1 },
          py: 2,
          borderRadius: "12px",
          maxWidth: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 300,
            color: theme.palette.widgets.tertiary[600],
            fontSize: { xl: "14px", xs: "13px" },
            mb: 1,
          }}
        >
          <span style={{ width: "85px", textAlign: "right", flexShrink: 0 }}>
          {t("network_members.unique_id")}:
          </span>
          <Box sx={{ ml: 1 }}>
            <Typography component="span" sx={{ fontWeight: 10, marginLeft:"20px" }}>
              {user?.unique_id}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 300,
            mb: 1,
            color: theme.palette.widgets.tertiary[600],
            fontSize: { xl: "14px", xs: "13px" },
          }}
        >
          <span style={{ width: "85px", textAlign: "right", flexShrink: 0 }}>
            {t("user_dashboard.currentrank")}:
          </span>

          <Box sx={{ ml: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <img src={Bronze} style={{ width: "16px" }} alt="current rank" />
            <Typography component="span" sx={{ fontWeight: 400 }}>
              {rank?.rank_name || "N/A"}
            </Typography>
            {rank?.is_confirmed === 0 && (
              <Typography
                component="span"
                sx={{ color: "#FF9800", fontWeight: 500, fontSize: "0.9em" }}
              >
                (Pending)
              </Typography>
            )}
          </Box>
        </Box>
        <Ternary
          when={rank?.next_rank}
          then={
            <Box
              sx={{
                fontWeight: 300,
                color: theme.palette.widgets.tertiary[600],
                fontSize: { xl: "14px", xs: "13px" },
                mb: 1,
              }}
            >
              <span
                style={{ width: "85px", float: "left", textAlign: "right" }}
              >
                {t("user_dashboard.nextrank")}:
              </span>
              <span style={{ float: "left", marginLeft: "8px" }}>
                <img
                  src={Silver}
                  style={{ width: "16px", margin: "0 4px" }}
                  alt="next rank"
                />
              </span>
              <span style={{ fontWeight: 400, marginLeft: "4px" }}>
                {rank?.next_rank}
              </span>
            </Box>
          }
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 300,
            color: theme.palette.widgets.tertiary[600],
            fontSize: { xl: "14px", xs: "13px" },
            mb: 1,
          }}
        >
          <span style={{ width: "85px", textAlign: "right", flexShrink: 0 }}>
          {t("user_dashboard.achieved_rank")}:
          </span>
          <Box sx={{ ml: 1 }}>
            <Typography component="span" sx={{ fontWeight: 10, marginLeft:"20px" }}>
              {rankStatus?.achieved_rank}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 300,
            color: theme.palette.widgets.tertiary[600],
            fontSize: { xl: "14px", xs: "13px" },
          }}
        >
          <span style={{ width: "85px", textAlign: "right", flexShrink: 0 }}>
          {t("user_dashboard.paid_rank")}:
          </span>
          <Box sx={{ ml: 1 }}>
            <Typography component="span" sx={{ fontWeight: 10 ,marginLeft:"20px" }}>
              {rankStatus?.paid_rank}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewLevel;
