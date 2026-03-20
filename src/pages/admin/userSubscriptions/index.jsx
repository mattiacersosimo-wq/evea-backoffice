import { Box } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import Active from "./components/active";
import Subscriptions from "./components/subscription";
import UserSubscriptions from "./components/users";

const ActiveSubscriptions = () => {
  return (
    <Page title={"adminUserSubscriptions.activeSubscriptionsTitile"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"adminUserSubscriptions.userSubscriptions"}
          links={[
            { name: "dashboard", href: PATH_DASHBOARD.root },
            { name: "adminUserSubscriptions.userSubscriptions" },
          ]}
        />
        <Active />
        <UserSubscriptions />
        <Subscriptions />
      </Box>
    </Page>
  );
};

export default ActiveSubscriptions;
