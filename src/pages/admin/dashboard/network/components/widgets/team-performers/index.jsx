import { Card, CardHeader, Grid, Typography } from "@mui/material";
import RankAchievers from "./components/rank-acheivers";
import TopEarners from "./components/top-earners";
import TopRecruiters from "./components/top-recruiters";
import Translate from "src/components/translate";

const TeamPerformers = () => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader sx={{p:0}}
        title={
          <Typography variant="subtitle2">
            <Translate>global.top_performers</Translate>
          </Typography>
        }
      />
      <Grid container spacing={2} mt={1}>
        <Grid item md={4} xs={12}>
          <TopEarners />
        </Grid>
        <Grid item md={4} xs={12}>
          <TopRecruiters />
        </Grid>

        <Grid item md={4} xs={12}>
          <RankAchievers />
        </Grid>
      </Grid>
    </Card>
  );
};

export default TeamPerformers;
