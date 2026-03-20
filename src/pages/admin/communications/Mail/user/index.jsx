import { Box, Card } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";
import { PermanentSidebar } from "../components/MailSideBar/permanentSidebar";
import useUserLabels from "./hooks/useUserLabels";

const Mail = () => {
  const { labels, fetchData } = useUserLabels();
  return (
    <Page
      sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }}
      title="Help Center : Email"
    >
      <Box>
        <HeaderBreadcrumbs
          sx={{ pl: 1, mb: 0 }}
          heading={"emails"}
          links={[
            { name: "dashboard", href: PATH_USER.root },
            {
              name: "emails",
            },
          ]}
        />
        <Card sx={{ height: "auto", display: { md: "flex" } }}>
          <PermanentSidebar labels={labels} />
          <Outlet context={{ labels: labels, fetchData }} />
        </Card>
      </Box>
    </Page>
  );
};

export default Mail;
