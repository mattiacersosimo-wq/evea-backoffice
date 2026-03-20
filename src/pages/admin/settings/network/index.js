import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { useMemo } from "react";
import { Outlet, useMatch, useNavigate } from "react-router";
import Iconify from "src/components/Iconify";

import { usePlan } from "src/store/plan";
import Wrapper from "./components/wrapper";
import tabs from "./tabs";
import { useTranslation } from "react-i18next";

const NetworkSettings = () => {
  const match = useMatch("/admin/settings/network/:slug");
  const navigate = useNavigate();

  const plan = usePlan();

  const chosenTabs = useMemo(
    () => tabs.filter(({ plans }) => plans.indexOf(plan) > -1),
    [plan, tabs]
  );
  const { t } = useTranslation();
  return (
    <>
      <Wrapper>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={match?.params?.slug}
          onChange={(_, v) => navigate(v)}
        >
          {chosenTabs.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={t(tab.value)}
              icon={<Iconify icon={tab.icon} width={20} height={20} />}
              value={tab.name}
              name={tab.name}
            />
          ))}
        </Tabs>
        <Box sx={{ mb: 2 }} />
        <Outlet />
      </Wrapper>
    </>
  );
};

export default NetworkSettings;
