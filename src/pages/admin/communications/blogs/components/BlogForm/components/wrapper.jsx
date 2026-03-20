import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children, isEdit }) => {
  return (
    <Page
      title={
        isEdit ? "blogs.create.form.edit_title" : "blogs.create.form.add_title"
      }
    >
      <Box>
        <HeaderBreadcrumbs
          sx={{ mb: 0, pl: 1 }}
          heading={
            isEdit
              ? "blogs.create.form.edit_title"
              : "blogs.create.form.add_title"
          }
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "blogs.title",
              href: PATH_DASHBOARD.communication.blog,
            },
            {
              name: isEdit
                ? "blogs.create.form.edit_title"
                : "blogs.create.form.add_title",
            },
          ]}
        />
        <Card sx={{ p: 3, mt: 3 }}>{children}</Card>
      </Box>
    </Page>
  );
};

export default Wrapper;
