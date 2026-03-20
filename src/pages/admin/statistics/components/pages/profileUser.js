import { Box, Card } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import ProfileCard from "./profilecard.js";
import PurchasedHistory from "./purchasedHistroy";

const AllUsersList = () => {
  return (
    <Page title={"adminStatistics.userProfile"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"adminStatistics.userProfile"}
          links={[
            { name: "dashboard", href: PATH_DASHBOARD.root },
            {
              name: "adminStatistics.statistics",
              href: PATH_DASHBOARD.statistics.root,
            },
            {
              name: "adminStatistics.allSubscriptionsUsers",
              href: PATH_DASHBOARD.statistics.subscriptions_users,
            },
            { name: "adminStatistics.userProfile" },
          ]}
        />
        <Card sx={{ p: 2, mb: 2 }}>
          <ProfileCard />
        </Card>
        <Card sx={{ p: 2 }}>
          <PurchasedHistory />
        </Card>
      </Box>
    </Page>
  );
};

export default AllUsersList;
