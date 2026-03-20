import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";
import DocCard from "./DocCard";

const Index = () => {
  return (
    <Page title="help_center.document.title">
      <Box>
        <HeaderBreadcrumbs
          heading="help_center.document.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "help_center.document.title" },
          ]}
        />
        <DocCard />
      </Box>
    </Page>
  );
};
export default Index;
