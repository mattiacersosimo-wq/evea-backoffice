import { Box, Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_USER } from "src/routes/paths";
import History from "./components/history";

const Subscriptions = () => {
  return (
    <Page title="business_builder.subscriptions.title">
      <Container maxWidth="100%">
        <HeaderBreadcrumbs
          heading="business_builder.subscriptions.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            {
              name: "business_builder.subscriptions.title",
            },
          ]}
        />
        <Box>
          <History />
        </Box>
      </Container>
    </Page>
  );
};

export default Subscriptions;
