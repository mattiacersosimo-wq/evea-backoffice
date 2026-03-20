import { Box, Card, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import Scrollbar from "src/components/Scrollbar";

import { capitalCase } from "change-case";
import Map from "src/components/map";
import ReferalIcon from "src/images/refer-outline.png";
import TeamCountIcon from "src/images/team-outline.png";
import useWidgetList from "./hooks/use-widget-list";

const icons = {
  downline_team_count: TeamCountIcon,
  total_referrals: ReferalIcon,
};

const Wrapper = ({ children, bgColor }) => {
  return (
    <Box
      sx={{
        backgroundColor: bgColor,
        borderRadius: "8px",
        width: "35px",
        height: "35px",
        mr: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};

const WidgetList = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const data = useWidgetList();

  return (
    <Card sx={{ paddingY: "30px" }}>
      <Scrollbar
        sx={{
          height: "250px",
          overflowY: "auto",
          borderRadius: "16px",
          px: "20px",
        }}
      >
        <Map
          list={Object.entries(data)}
          render={([k, v]) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "calc(100% - 33px)",
                  }}
                >
                  <Wrapper bgColor={theme.palette.widgets.blue[200]}>
                    <img src={icons[k]} style={{ width: "20px" }} />
                  </Wrapper>

                  <Box sx={{ width: "calc(100% - 45px)" }}>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        color:theme.palette.widgets.tertiary[600],
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {capitalCase(k)}
                    </Typography>

                    {/* <Box sx={{ fontSize: "12px" }}>
                      <span style={{ color: theme.palette.widgets.green[500] }}>
                        12%
                      </span>
                      <Typography variant="subtitle3"
                        style={{
                          paddingLeft: "6px",
                          fontWeight: "300",
                        }}
                      >
                        {t("user_dashboard.referralsTitle")}
                      </Typography>
                    </Box> */}
                  </Box>
                </Box>

                <Box
                  sx={{ fontSize: "14px", fontWeight: "500", color:theme.palette.widgets.tertiary[600], }}
                >
                  {v}
                </Box>
              </Box>
            );
          }}
        />
      </Scrollbar>
    </Card>
  );
};

export default WidgetList;
