import { Box, Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children }) => {
  const { themeStretch } = useSettings();

  return (
    <Page title={"profile.title"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"profile.title"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "profile.title" },
          ]}
        />
        {children}
      </Box>
    </Page>
  );
};

export default Wrapper;
