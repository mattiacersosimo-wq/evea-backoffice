import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./components/dataTable";

const PendingRanks = () => {
  return (
    <Page title="pendingranks.table.title">
      <Box>
        <HeaderBreadcrumbs
          heading="pendingranks.table.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "pendingranks.table.title" },
          ]}
        />

        <DataTable />
      </Box>
    </Page>
  );
};

export default PendingRanks;
