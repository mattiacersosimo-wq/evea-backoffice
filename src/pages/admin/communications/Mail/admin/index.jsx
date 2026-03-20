import { Box, Card } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import { PermanentSidebar } from "../components/MailSideBar/permanentSidebar";
import useAdminLabels from "./hooks/useAdminLabels";

const Mail = () => {
  const { labels, fetchData } = useAdminLabels();

  return (
    <Page title="emails.title">
      <Box>
        <HeaderBreadcrumbs
          sx={{ pl: 1, mb: 0 }}
          heading="emails.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "emails.title",
            },
          ]}
        />
        <Card sx={{ height: "auto", display: { md: "flex" } }}>
          <PermanentSidebar labels={labels} fetchData={fetchData} />
          <Outlet context={{ labels: labels, fetchData }} />
        </Card>
      </Box>
    </Page>
  );
};

export default Mail;
