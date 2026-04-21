import { Box, Card, Grid, Typography } from "@mui/material";
import useGetRankSummary from "./hook/useGetRankSummary";
import Timer from "./timer";
import TimerImage from "src/images/Timer.svg";
import CurrentRankImage from "src/images/current_rank.svg";
import RecognisedRankImage from "src/images/Recognition_rank.svg";
import AchievedRankImage from "src/images/Achieved_rank.svg";
import { useTranslation } from "react-i18next";
import useGetCurrentPackagePeriod from "./hook/useGetCurrentPackagePeriod";

const RankSummary = () => {
  const rankSummary = useGetRankSummary();
  const currentPackagePeriod = useGetCurrentPackagePeriod();
  const { t } = useTranslation();

  const showPackageTimer = currentPackagePeriod?.qualification_days !== 0;

  return (
    <>
      <Box sx={{ py: 1 }}>
        <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="stretch">
          <Grid item xs={showPackageTimer ? 6 : 12} sm={6} md={showPackageTimer ? 3 : 4}>
            <Card
              sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center", height: "100%", boxShadow: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <img src={TimerImage} style={{ width: 32, height: 32 }} />
              </Box>

              <Typography
                sx={{ pr: 1, lineHeight: 1.2 }}
                fontSize={11}
                variant="subtitle2"
                color="text.secondary"
              >
                {t("affiliate_dashboard.current_period_ends_in")}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                <Timer expiryDate={rankSummary?.month_end} />
              </Typography>
            </Card>
          </Grid>

          {showPackageTimer && (
            <Grid item xs={6} sm={6} md={3}>
              <Card
                sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center", height: "100%", boxShadow: 3 }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <img src={TimerImage} style={{ width: 32, height: 32 }} />
                </Box>

                <Typography
                  sx={{ pr: 1, lineHeight: 1.2 }}
                  fontSize={11}
                  variant="subtitle2"
                  color="text.secondary"
                >
                  {t("affiliate_dashboard.dsp_ends_in")}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  <Timer expiryDate={currentPackagePeriod?.period_end} />
                </Typography>
              </Card>
            </Grid>
          )}

          <Grid item xs={4} sm={6} md={showPackageTimer ? 2 : 4}>
            <Card
              sx={{ p: { xs: 1, sm: 2 }, textAlign: "center", height: "100%", boxShadow: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <img src={CurrentRankImage} style={{ width: 30, height: 30 }} />
              </Box>
              <Typography
                fontSize={11}
                variant="subtitle2"
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                {t("affiliate_dashboard.currentRank")}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1.25rem" } }} fontWeight="bold">
                {rankSummary?.current_rank}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4} sm={6} md={showPackageTimer ? 2 : 4}>
            <Card
              sx={{ p: { xs: 1, sm: 2 }, textAlign: "center", height: "100%", boxShadow: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <img
                  src={RecognisedRankImage}
                  style={{ width: 34, height: 34 }}
                />
              </Box>
              <Typography
                fontSize={11}
                variant="subtitle2"
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                {t("affiliate_dashboard.recognition_rank")}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1.25rem" } }} fontWeight="bold">
                {rankSummary?.paid_rank}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4} sm={6} md={showPackageTimer ? 2 : 4}>
            <Card
              sx={{ p: { xs: 1, sm: 2 }, textAlign: "center", height: "100%", boxShadow: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <img
                  src={AchievedRankImage}
                  style={{ width: 34, height: 34 }}
                />
              </Box>
              <Typography
                fontSize={11}
                variant="subtitle2"
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                {t("affiliate_dashboard.achieved_rank")}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1.25rem" } }} fontWeight="bold">
                {rankSummary?.achieved_rank}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RankSummary;
