import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Outlet, useMatch } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

import { useTranslation } from "react-i18next";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import KycUsers from "./components/orders";
import Orders from "./components/orders";

const OrderApproval = () => {
  const { t } = useTranslation();

  return (
    <Page title="global.OrderApproval">
      <Box>
        <HeaderBreadcrumbs
          heading="global.OrderApproval"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "global.OrderApproval" },
          ]}
        />
        <Orders />
      </Box>
    </Page>
  );
};

export default OrderApproval;
