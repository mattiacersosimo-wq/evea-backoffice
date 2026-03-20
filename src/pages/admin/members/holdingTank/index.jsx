import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./components/dataTable";

const Index = () => {
  return (
    <div>
      <Page title={"holding_tank.holding_tank"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"holding_tank.holding_tank"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "holding_tank.holding_tank",
              },
            ]}
          />

          <DataTable />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
