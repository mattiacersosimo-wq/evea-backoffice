import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import TeamUnified from "src/pages/user/reports/team-unified";

const List = () => {
  return (
    <Page title="genealogy.list.title">
      <Box sx={{ px: { xs: 1, md: 2 } }}>
        <HeaderBreadcrumbs
          heading="genealogy.list.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "genealogy.list.title" },
          ]}
        />
        <TeamUnified />
      </Box>
    </Page>
  );
};

export default List;
