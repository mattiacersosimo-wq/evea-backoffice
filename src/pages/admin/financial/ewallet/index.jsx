import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./components/dataTable";

const EWallet = () => {
  return (
    <Page title="financial.e_wallet.title">
      <Box>
        <HeaderBreadcrumbs
          heading="financial.e_wallet.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "financial.e_wallet.title" },
          ]}
        />

        <DataTable />
      </Box>
    </Page>
  );
};

export default EWallet;
