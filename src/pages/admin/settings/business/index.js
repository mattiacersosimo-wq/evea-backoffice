import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import MainSection from "./business/index";

const Index = () => {
  return (
    <>
      <Page title={"settings.business_builder.title"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"settings.business_builder.business_builder"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "settings.business_builder.business_builder",
              },
            ]}
          />
          <Box>
            <MainSection />
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default Index;
