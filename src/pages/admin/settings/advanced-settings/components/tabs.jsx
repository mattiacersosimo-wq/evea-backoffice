import { Box, Tabs as MuiTabs, Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMatch, useNavigate } from "react-router";
import _tabs from "../tabs";

const Tabs = () => {
  const match = useMatch("/admin/settings/advanced-settings/:slug");
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mb: 2,
      }}
    >
      <MuiTabs
        value={match?.params?.slug}
        onChange={(_, v) => navigate(v)}
        aria-label="basic tabs example"
      >
        {_tabs.map(({ label, href }) => (
          <Tab key={href} value={href} label={t(label)} />
        ))}
      </MuiTabs>
    </Box>
  );
};

export default Tabs;
