import { Box, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Outlet, useMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Wrapper from "./components/assign-wrapper";
import TABS from "./tabs";
import { useTranslation } from "react-i18next";

const Index = () => {
  const match = useMatch("/admin/store/assign-subscriptions/:slug");
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Card sx={{ p: 3 }}>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={match?.params?.slug}
        >
          {TABS.map((tab) => (
            <Tab
              LinkComponent={NavLink}
              to={tab.value}
              disableRipple
              key={tab.value}
              label={capitalCase(t(tab.name))}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 2 }} />

        <Outlet />
      </Card>
    </Wrapper>
  );
};

export default Index;
