// @mui
import { Box } from "@mui/material";
// Components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";
import ContactSupport from "./components/contactSupport";
import MySupportTickets from "./components/mySupportTickets";
import OtherSupport from "./components/others";

const Index = () => {
  return (
    <>
      <Page
        sx={{ p: { md: 0, lg: 0, md: "10px", xs: "10px" } }}
        title={"userHelpCenter.ticket.titile"}
      >
        <Box>
          <HeaderBreadcrumbs
            sx={{ pl: 1, mb: 0 }}
            heading={"userHelpCenter.ticket.helpCenterTicket"}
            links={[
              { name: "dashboard", href: PATH_USER.root },
              { name: "userHelpCenter.ticket.helpCenterTicket" },
            ]}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "repeat(3, 1fr)",
                sm: "repeat(2, 1fr)",
              },
              columnGap: 3,
              rowGap: 3,
            }}
          >
            <ContactSupport />
            <MySupportTickets />
            <OtherSupport />
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default Index;
