import { Box } from "@mui/material";
import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import DataTable from "./components/dataTable";

const DepositWallet = () => {
  return (
    <div>
      <Page title={"financial.deposit_wallet.title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"financial.deposit_wallet.title"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "financial.deposit_wallet.title" },
            ]}
          />
          <DataTable />
        </Box>
      </Page>
    </div>
  );
};

export default DepositWallet;
