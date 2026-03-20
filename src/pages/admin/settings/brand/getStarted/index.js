import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import Iconify from "src/components/Iconify";

import useTabs from "src/hooks/useTabs";
import Articles from "./articles";
import Section from "./section";
import { useTranslation } from "react-i18next";

const UserGuidance = () => {
  const { currentTab, onChangeTab } = useTabs("sections");

  const USER_GUIDANCE_TABS = [
    {
      value: "sections",
      icon: <Iconify icon={"radix-icons:section"} width={20} height={20} />,
      component: <Section />,
      name: "settings.brand.section",
    },
    {
      value: "articles",
      icon: (
        <Iconify
          icon={"pixelarticons:article-multiple"}
          width={20}
          height={20}
        />
      ),
      component: <Articles />,
      name: "settings.brand.articles",
    },
  ];
  const { t } = useTranslation();
  return (
    <div>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={currentTab}
        onChange={onChangeTab}
      >
        {USER_GUIDANCE_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            label={capitalCase(t(tab.name))}
            icon={tab.icon}
            value={tab.value}
            name={tab.name}
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }} />
      {USER_GUIDANCE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </div>
  );
};

export default UserGuidance;
