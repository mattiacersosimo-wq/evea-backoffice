import React from "react";
// @mui
import { Box, CardHeader, Grid } from "@mui/material";
// components
import { AnalyticsWidgetSummary } from "src/sections/@dashboard/general/analytics";
const CardsOverall = () => {
  return (
    <div>
      <CardHeader title="Overall Details" sx={{ marginBottom: "1rem" }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Down line Count"
            total={8}
            icon={"ant-design:arrow-down-outlined"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Income "
            total={820}
            icon={"simple-icons:bitcoincash"}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Payout"
            total={333}
            icon={"bi:cash"}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Pending Payout"
            total={99}
            icon={"mdi:cash-refund"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Order"
            total={323}
            icon={"clarity:shopping-cart-solid-badged"}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Subscriptions"
            total={589}
            icon={"wpf:renew-subscription"}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Fund Credited"
            total={666}
            icon={"fluent:credit-card-clock-28-filled"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AnalyticsWidgetSummary
            title="Total Personal Referrals"
            total={444}
            icon={"bxs:trophy"}
            color="info"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CardsOverall;
