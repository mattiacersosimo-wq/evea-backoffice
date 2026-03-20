import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import BrandTabs from "./brandTabs";

const Brand = () => {
  return (
    <>
      <Page title={"settings.brand.title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"settings.brand.brand"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "settings.brand.brand" },
            ]}
          />
          <BrandTabs />
        </Box>
      </Page>
    </>
  );
};

export default Brand;
