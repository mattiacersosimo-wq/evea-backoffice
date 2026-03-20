import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import Export from "./export";
import useFilter from "./hooks/use-filter";

const Reports = () => {
  const [data, setData] = useState({ title: "", heading: "", type: "" });

  const { heading, title, type } = data;
  const methods = useFilter();

  return (
    <>
      <Page title={title}>
        <Box>
          <HeaderBreadcrumbs
            heading={heading}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: heading },
            ]}
            action={<Export methods={methods} type={type} />}
          />
          <Outlet context={{ setData, methods }} />
        </Box>
      </Page>
    </>
  );
};

export default Reports;
