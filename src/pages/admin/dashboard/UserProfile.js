import { Box, Card, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { Outlet, useNavigate } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import TabsWrapperStyle from "src/components/TabsWrapperStyle";
import useCustomTabs from "src/hooks/useCustomTabs";
import { PATH_DASHBOARD } from "src/routes/paths";
import { ProfileCover } from "src/sections/user/profile";
// import PROFILE_TABS from "./profileTabs";

import useProfileTabs from "./profileTabs";
import { useTranslation } from "react-i18next";
import isSubAdmin from "src/utils/is-sub-admin";
import useAuth from "src/hooks/useAuth";
const UserProfile = () => {
  const PROFILE_TABS = useProfileTabs();
  const { isSubAdmin } = useAuth();
  const navigate = useNavigate();
  const { currentTab, onChangeTab } = useCustomTabs("profile", "profile");
  const { t } = useTranslation();
  return (
    <Page title={"profile.title"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"profile.title"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "profile.title" },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <ProfileCover />
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
              style={{ width: "85%" }}
            >
              {PROFILE_TABS.map((tab) => {
                if (tab.is_subAdmin) {
                  if (isSubAdmin) return;
                }
                return (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    icon={tab.icon}
                    name={tab.name}
                    label={t(tab.label)}
                    onClick={() => navigate(tab.href)}
                  />
                );
              })}
            </Tabs>
          </TabsWrapperStyle>
        </Card>
        <Outlet />
      </Box>
    </Page>
  );
};

export default UserProfile;
