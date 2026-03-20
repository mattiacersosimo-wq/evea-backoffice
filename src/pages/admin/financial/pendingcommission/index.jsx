import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./components/dataTable";

const PendingCommission = () => {
  return (
    <Page title="financial.pendingcommission.title">
      <Box>
        <HeaderBreadcrumbs
          heading="financial.pendingcommission.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "financial.pendingcommission.title" },
          ]}
        />

        <DataTable />
      </Box>
    </Page>
  );
};

export default PendingCommission;
