import { Box, Card } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DataTable from "./dataTable";

const AllUsersList = () => {
  return (
    <Page title={"adminStatistics.allSubscriptionsUsers"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"adminStatistics.allSubscriptionsUsers"}
          links={[
            { name: "dashboard", href: PATH_DASHBOARD.root },
            {
              name: "adminStatistics.statistics",
              href: PATH_DASHBOARD.statistics.root,
            },
            { name: "adminStatistics.allSubscriptionsUsers" },
          ]}
        />
        <Card sx={{ p: 2 }}>
          <DataTable />
        </Card>
      </Box>
    </Page>
  );
};

export default AllUsersList;
