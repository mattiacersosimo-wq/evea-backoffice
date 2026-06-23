import { Grid } from "@mui/material";
import Page from "src/components/Page";
import Events from "./components/events";

import moment from "moment";
import useFetchEvents from "src/pages/user/dashboard/components/events/hooks/useFetchEvents.js";
import { HideFromHoldingTank } from "./components/wrappers";
import {
  ActiveSubscriptionList,
  ActiveUserWidget,
  AllEventsList,
  BusinessBuilderReqWidget,
  BusinessBuilderWidget,
  HigherRankProgressWidget,
  ProductList,
  ReferralWidget,
  UserJoinWidget,
} from "./new/componets";
import UserWidgets from "./new/componets/userWidgets";

const Dashboard = () => {
  return (
    <Page title="Dashboard">
      <Grid container spacing={2} sx={{ p: 1 }}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <HideFromHoldingTank>
                <ReferralWidget />
              </HideFromHoldingTank>
            </Grid>
            <Grid item xs={12} md={12}>
              <ActiveSubscriptionList />
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <BusinessBuilderReqWidget />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ActiveUserWidget />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <HigherRankProgressWidget />
            </Grid>

            <Grid item xs={12} md={12}>
              <UserJoinWidget />
            </Grid>
            <Grid item xs={12} md={12}>
              <BusinessBuilderWidget />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid item xs={12} md={12}>
            <EventGrid />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2} mt={1}>
              <UserWidgets />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <ProductList />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

const getFutureEvents = (events = []) =>
  events?.filter(
    ({ converted_date }) => moment(converted_date).diff(moment()) > 0
  );

const EventGrid = () => {
  const { data } = useFetchEvents();

  return (
    <>
      <Grid item xs={12} md={12} className="dashboard-calender">
        <Events events={data} />
      </Grid>
      <Grid item xs={12} md={12} mt={3}>
        <AllEventsList events={getFutureEvents(data)} />
      </Grid>
    </>
  );
};

export default Dashboard;
