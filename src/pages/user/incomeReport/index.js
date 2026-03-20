import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./components/dataTable";

const Index = () => {
  return (
    <>
      <Page title="user.income_report.title">
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading="user.income_report.title"
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "user.income_report.title" },
            ]}
          />
          <DataTable />
        </Box>
      </Page>
    </>
  );
};

export default Index;
