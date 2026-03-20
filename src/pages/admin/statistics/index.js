import { Box, Card, Container, Grid } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  ChartStatitics,
  MainWidget,
  PurchasedTabs,
  SearchDataTable,
  SubscriptionsWidgets,
} from "./components";

const Statistics = () => {
  const { themeStretch } = useSettings();

  return (
    <Page title="Statistics">
      <Box sx={{ p: 2 }}>
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MainWidget
                title={"adminStatistics.totalSubscription"}
                total={129}
                icon={"ant-design:user-outlined"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MainWidget
                title={"adminStatistics.mostPurchasedProduct"}
                total={38566}
                icon={"bx:user"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MainWidget
                title={"adminStatistics.mostActiveProduct"}
                total={658.0}
                icon={"bxs:user"}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <SearchDataTable />
            </Grid>
            <Grid item xs={12} md={4}>
              <SubscriptionsWidgets
                title={"adminStatistics.totalSubscription"}
                total={4445}
                icon={"eos-icons:subscription-management"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SubscriptionsWidgets
                title={"adminStatistics.activeSubscription"}
                total={125}
                icon={"eos-icons:subscription-management"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SubscriptionsWidgets
                title={"adminStatistics.expiredSubscriptions"}
                total={99}
                icon={"eos-icons:subscription-management"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PurchasedTabs />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartStatitics />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default Statistics;
