import { Grid } from "@mui/material";
import Page from "src/components/Page";
import {
  LatestRegistration,
  MemberMapWidget,
  NetworkBonus,
  SupportTicketWidget,
} from "./components";
import Total from "./components/total";
import RegisteredMembers from "./components/widgets/registered-members";
import UsersJoin from "./components/widgets/users-join";

import TeamPerformers from "./components/widgets/team-performers";

const Index = () => {
  return (
    <Page title="Dashboard">
      <Grid container spacing={2}>
        <Grid container spacing={2} item md={4}>
          <Total />
          <Grid item xs={12}>
            <SupportTicketWidget />
          </Grid>
        </Grid>
        <Grid item md={8} container spacing={2}>
          <Grid item md={8} xs={12} sm={6}>
            <NetworkBonus />
          </Grid>

          <Grid item md={4} xs={12} sm={6}>
            <RegisteredMembers />
          </Grid>
        </Grid>
        <Grid container spacing={2} item md={6}>
          <Grid item xs={12} md={12}>
            <MemberMapWidget />
          </Grid>

          <Grid item xs={12} md={12}>
            <UsersJoin />
          </Grid>
        </Grid>
        <Grid container spacing={2} item md={6}>
          <Grid item xs={12} md={12}>
            <LatestRegistration />
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12}>
            <TeamPerformers />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Index;
