import { Box, Card, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";

const RouteContainer = ({ children }) => {
  return (
    <Page
      sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }}
      title="help_center.title"
    >
      <Box>
        <HeaderBreadcrumbs
          sx={{ pl: 1, mb: 0 }}
          heading="help_center.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "help_center.title",
              href: PATH_DASHBOARD.communication.help_center,
            },
          ]}
        />

        <Card sx={{ p: 2, overflow: "visible" }}>
          <Grid container spacing={3}>
            {children}
          </Grid>
        </Card>
      </Box>
    </Page>
  );
};

export default RouteContainer;
