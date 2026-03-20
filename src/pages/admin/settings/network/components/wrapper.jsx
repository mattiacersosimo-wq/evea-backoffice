import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children }) => {
  return (
    <>
      <Page title={"settings.network.title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"settings.network.network"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "settings.network.network" },
            ]}
          />
          <Card sx={{ p: 2 }}>{children}</Card>
        </Box>
      </Page>
    </>
  );
};

export default Wrapper;
