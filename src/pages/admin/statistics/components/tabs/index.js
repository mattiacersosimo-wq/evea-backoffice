import { Box, Button, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useTabs from "src/hooks/useTabs";

import { PATH_DASHBOARD } from "src/routes/paths";
import Also from "./also";
import Nothing from "./nothing";

const PurchasedTabs = () => {
  const { currentTab, onChangeTab } = useTabs("also");

  const HELPCENTER_TABS = [
    {
      value: "also",
      text: "adminStatistics.userAlsoPurchased",
      component: <Also />,
    },
    {
      value: "nothing",
      text: "adminStatistics.nothingPurchasedUsers",
      component: <Nothing />,
    },
  ];
  return (
    <>
      <Card sx={{ p: 2 }}>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {HELPCENTER_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.text)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Box sx={{ mb: 2 }} />
        {HELPCENTER_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Card>
    </>
  );
};

export default PurchasedTabs;
