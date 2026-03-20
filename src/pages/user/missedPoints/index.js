import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./dataTable";

const Index = () => {
  return (
    <>
      <Page title="Missed Points">
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading="Missed Points"
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Missed Points" },
            ]}
          />
          <DataTable />
        </Box>
      </Page>
    </>
  );
};

export default Index;
