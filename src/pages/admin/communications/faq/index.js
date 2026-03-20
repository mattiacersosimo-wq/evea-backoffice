import { Box, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";
import useCustomTabs from "src/hooks/useCustomTabs";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);

  return {
    category: test("category"),
  };
};
const FAQS_TABS = [
  {
    value: "faqs",
    icon: <Iconify icon={"carbon:archive"} width={20} height={20} />,
    href: PATH_DASHBOARD.communication.com_faqs,
    name: "faq.tabs.faq",
  },
  {
    value: "faq-category",
    icon: (
      <Iconify
        icon={"icon-park-outline:category-management"}
        width={20}
        height={20}
      />
    ),
    href: "category",
    name: "faq.tabs.categories",
  },
];
const Faqs = () => {
  const status = genStatus("nav.communication.title", "nav.communication.faqs");

  const { currentTab, onChangeTab } = useCustomTabs("faqs", "faqs");
  const navigate = useNavigate();

  const { t } = useTranslation();
  return (
    <Page title="faq.title">
      <Box>
        <HeaderBreadcrumbs
          heading="faq.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "faq.title" },
          ]}
        />
        <Ternary
          when={status.category}
          then={
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
              sx={{ p: 1 }}
            >
              {FAQS_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  label={t(tab.name)}
                  icon={tab.icon}
                  value={tab.value}
                  name={tab.name}
                  onClick={() => navigate(tab.href)}
                />
              ))}
            </Tabs>
          }
        />

        <Outlet />
      </Box>
    </Page>
  );
};

export default Faqs;
