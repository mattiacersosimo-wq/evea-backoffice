import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./component/dataTable";

const Network = () => {
  return (
    <Page title={"network_members.network_members"}>
      <Box>
        <HeaderBreadcrumbs
          heading={"network_members.network_members"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "network_members.network_members",
            },
          ]}
        />
        <DataTable />
      </Box>
    </Page>
  );
};

export default Network;
