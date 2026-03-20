import {
  Box,
  Card,
  Collapse,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ResidualBonus from "./components/widgets/ResidualBonus";
import ResidualBonusMatching from "./components/widgets/ResidualBonusMatching";
import RockSolidBonus from "./components/widgets/RockSolidBonus";
import LeadershipBonus from "./components/widgets/LeadershipBonus";
import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import { useTranslation } from "react-i18next";

const ResidualReward = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ p: 2, boxShadow: 3 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1">
            {t("user_dashboard.residual_rewards")}
          </Typography>
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            size="small"
            sx={{
              backgroundColor: "#cccccc47",
              transition: "transform 0.4s ease-in-out",
              transform: open ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <Iconify icon="ep:arrow-up-bold" />
          </IconButton>
        </Box>
        <Collapse in={open} collapsedSize={0}>
          <Grid container spacing={2} sx={{ p: "0 10px" }}>
            <Box
              sx={{
                pl: { lg: "10px", md: "0" },
                width: {
                  // xl: "calc(100% - 365px)",
                  // lg: "calc(100% - 295px)",
                  sm: "100%",
                  xs: "100%",
                },
                mt: 2,
              }}
            >
              <Grid container spacing={2}>
                <Ternary
                  when={user?.is_promoter}
                  then={
                    <>
                      <Grid item lg={12} md={12} xs={12}>
                        <ResidualBonus />
                      </Grid>
                      <Grid item lg={12} md={12} xs={12}>
                        <LeadershipBonus />
                      </Grid>
                      <Grid item lg={12} md={12} xs={12}>
                        <ResidualBonusMatching />
                      </Grid>
                      <Grid item lg={12} md={12} xs={12}>
                        <RockSolidBonus />
                      </Grid>
                    </>
                  }
                />
              </Grid>
            </Box>
          </Grid>
        </Collapse>
      </Card>
    </>
  );
};

export default ResidualReward;
