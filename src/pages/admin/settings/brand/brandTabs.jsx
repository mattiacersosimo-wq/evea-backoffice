import { Box, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import Iconify from "src/components/Iconify";
import useCustomTabs from "src/hooks/useCustomTabs";

import { useTranslation } from "react-i18next";
import CompanyDetails from "./companyDetails";
import GetStarted from "./getStarted";
import UserGuidance from "./userGuidance";

const BrandTabs = () => {
  const tabs = useCustomTabs("details", "details");

  return (
    <Card sx={{ p: 3 }}>
      {/* <TabHeaders {...tabs} /> */}
      <Box sx={{ mb: 2 }} />
      <TabItems currentTab={tabs.currentTab} />
    </Card>
  );
};

const TabHeaders = ({ currentTab, onChangeTab }) => {
  const { t } = useTranslation();
  const BRAND_TABS = [
    {
      label: "settings.brand.company_details",
      value: "details",
      icon: <Iconify icon={"ep:office-building"} width={20} height={20} />,
      component: <CompanyDetails />,
      name: "details",
    },
    {
      label: "settings.brand.get_started",
      value: "get-started",
      icon: <Iconify icon={"cil:book"} width={20} height={20} />,
      component: <GetStarted />,
      name: "get-started",
    },
    {
      value: "user-guidance",
      label: "settings.brand.user_guidance",
      icon: (
        <Iconify
          icon={"fluent:cursor-click-24-regular"}
          width={20}
          height={20}
        />
      ),
      component: <UserGuidance />,
      name: "user-guidance",
    },
  ];
  return (
    <Tabs
      allowScrollButtonsMobile
      variant="scrollable"
      scrollButtons="auto"
      value={currentTab}
      onChange={onChangeTab}
    >
      {BRAND_TABS.map((tab) => (
        <Tab
          disableRipple
          key={tab.value}
          label={capitalCase(t(tab.label))}
          icon={tab.icon}
          value={tab.value}
          name={tab.name}
        />
      ))}
    </Tabs>
  );
};

const TabItems = ({ currentTab }) => {
  const BRAND_TABS = [
    {
      value: "details",
      icon: <Iconify icon={"ep:office-building"} width={20} height={20} />,
      component: <CompanyDetails />,
      name: "settings.brand.company_details",
    },
    {
      value: "get-started",
      icon: <Iconify icon={"cil:book"} width={20} height={20} />,
      component: <GetStarted />,
      name: "settings.brand.get_started",
    },
    {
      value: "user-guidance",
      icon: (
        <Iconify
          icon={"fluent:cursor-click-24-regular"}
          width={20}
          height={20}
        />
      ),
      component: <UserGuidance />,
      name: "settings.brand.user_guidance",
    },
  ];
  return (
    <>
      {BRAND_TABS.map(
        (tab) =>
          tab.value === currentTab && <Box key={tab.value}>{tab.component}</Box>
      )}
    </>
  );
};

export default BrandTabs;
