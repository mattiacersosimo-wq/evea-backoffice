import { Box } from "@mui/material";
import { Outlet } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import Tabs from "./components/tabs";

const AdvancedSettings = () => {
  return (
    <>
      <Page title={"settings.advanced_settings.title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"settings.advanced_settings.title"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "settings.advanced_settings.title",
              },
            ]}
          />

          <Tabs />

          <Outlet />
        </Box>
      </Page>
    </>
  );
};

export default AdvancedSettings;
