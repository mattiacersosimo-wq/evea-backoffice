import { Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMatch, useNavigate } from "react-router";
import Iconify from "src/components/Iconify";
import TabsWrapperStyle from "src/components/TabsWrapperStyle";
import useAuth from "src/hooks/useAuth";
import { useAppConfig } from "src/store/app-config";
import TABS from "./tabs";

const ProfileTabs = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { params } = useMatch("/user/profile/:slug") || {};
  const currentTab = params?.slug;
  const { isHoldingTank } = user;
  const { config } = useAppConfig();

  return (
    <TabsWrapperStyle>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={currentTab}
        onChange={(_, v) => navigate(v)}
        style={{ width: "85%" }}
      >
        {TABS.map((tab) => {
          const { icon, name, label, href, is_holding, isKyc } = tab;
          if (is_holding) {
            if (isHoldingTank) return;
          }

          if (isKyc) {
            if (config?.kyc_enable?.status === false) {
              return null;
            }
          }
          return (
            <Tab
              disableRipple
              key={href}
              value={href}
              icon={<Iconify icon={icon} width={20} height={20} />}
              name={name}
              label={t(label)}
            />
          );
        })}
      </Tabs>
    </TabsWrapperStyle>
  );
};

export default ProfileTabs;
