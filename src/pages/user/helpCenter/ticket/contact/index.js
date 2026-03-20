import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";
import CreateTicket from "./createTicket";

const Index = () => {
  return (
    <>
      <Page title="support_tickets.contact_support.title">
        <Box sx={{ p: 0 }}>
          <HeaderBreadcrumbs
            heading="support_tickets.contact_support.title"
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              {
                name: "support_tickets.title",
                href: PATH_USER.helpCenter.createTicket.subCategory(),
              },
              { name: "support_tickets.contact_support.title" },
            ]}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                md: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
              columnGap: 3,
              rowGap: 3,
            }}
          >
            <CreateTicket />
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default Index;
