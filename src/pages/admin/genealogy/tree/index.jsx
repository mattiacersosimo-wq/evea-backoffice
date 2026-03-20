import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DropDownTree from "src/components/drop-down-tree";
import { PATH_DASHBOARD } from "src/routes/paths";

const Index = () => {
  return (
    <Page title="genealogy.tree.title">
      <Box>
        <HeaderBreadcrumbs
          heading="genealogy.tree.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "genealogy.tree.title" },
          ]}
        />
        <Card sx={{ p: 2 }}>
          <DropDownTree URL="api/admin/tree" />
        </Card>
      </Box>
    </Page>
  );
};

export default Index;
