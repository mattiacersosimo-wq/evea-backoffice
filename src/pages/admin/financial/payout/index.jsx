import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Outlet, useMatch } from "react-router";
import { Link } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

import { useTranslation } from "react-i18next";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import TABS from "./tabs";

const Payout = () => {
  const match = useMatch("/admin/financial/payout/:slug");
  const { t } = useTranslation();

  return (
    <Page title="financial.payout.admin.title">
      <Box>
        <HeaderBreadcrumbs
          heading="financial.payout.admin.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "financial.payout.admin.title" },
          ]}
        />

        <Box sx={{ p: 1 }}>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={match?.params?.slug}
          >
            {TABS.map((tab) => (
              <Tab
                LinkComponent={Link}
                to={tab.value}
                disableRipple
                key={tab.value}
                label={t(tab.text)}
                icon={tab.icon}
                value={tab.value}
                name={tab.name}
              />
            ))}
          </Tabs>
          <Box sx={{ mb: 2 }} />

          <Outlet />
        </Box>
      </Box>
    </Page>
  );
};

export default Payout;
