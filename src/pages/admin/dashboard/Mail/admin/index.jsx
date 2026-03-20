import { Box, Card } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import { PermanentSidebar } from "../components/MailSideBar/permanentSidebar";
import useAdminLabels from "./hooks/useAdminLabels";

const Mail = () => {
  const labels = useAdminLabels();

  return (
    <Page title="Emails">
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading="Emails"
          links={[
            { name: "dashboard", href: PATH_DASHBOARD.root },
            { name: "Emails" },
          ]}
        />
        <Card sx={{ height: { md: "72vh" }, display: { md: "flex" } }}>
          <PermanentSidebar labels={labels} />
          <Outlet context={{ labels: labels }} />
        </Card>
      </Box>
    </Page>
  );
};

export default Mail;
