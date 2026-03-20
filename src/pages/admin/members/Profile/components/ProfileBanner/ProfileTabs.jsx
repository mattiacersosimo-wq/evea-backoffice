import { Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import { useTranslation } from "react-i18next";
import { useMatch, useNavigate } from "react-router";
import TabsWrapperStyle from "src/components/TabsWrapperStyle";
import useIsMemberUser from "../../hooks/use-is-member-user";
import PROFILE_TABS from "../../profileTabs";

const ProfileTabs = () => {
  const { t } = useTranslation();
  const matches = useMatch("/admin/members/profile/:mid/:slug");
  const activeTab = matches?.params?.slug;
  const navigate = useNavigate();

  const isUser = useIsMemberUser();
  return (
    <TabsWrapperStyle>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, v) => navigate(v)}
        value={activeTab}
      >
        {PROFILE_TABS.map((tab) => {
          const { icon, value, label, user } = tab;

          if (!user)
            return (
              <Tab
                disableRipple
                key={value}
                value={value}
                icon={icon}
                name={value}
                label={t(label)}
              />
            );

          if (isUser && user)
            return (
              <Tab
                disableRipple
                key={value}
                value={value}
                icon={icon}
                name={value}
                label={capitalCase(t(label))}
              />
            );
        })}
      </Tabs>
    </TabsWrapperStyle>
  );
};
export default ProfileTabs;
