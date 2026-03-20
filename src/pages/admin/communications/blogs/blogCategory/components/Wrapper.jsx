import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Translate from "src/components/translate";

import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children, handleClickOpenAddCategory }) => {
  return (
    <Page title="blogs.categories.title">
      <Box>
        <HeaderBreadcrumbs
          sx={{ pl: 1, mb: 0 }}
          heading="blogs.categories.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "blogs.title",
              href: PATH_DASHBOARD.communication.blog,
            },
            { name: "blogs.categories.title" },
          ]}
          action={
            <>
              <Box
                sx={{
                  display: "grid",
                  columnGap: 1,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.communication.newBlog}
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  name="add-post"
                >
                  <Translate>blogs.create.new_post</Translate>
                </Button>
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.communication.blogCategories}
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  onClick={handleClickOpenAddCategory}
                  name="add-category"
                >
                  <Translate>blogs.create.category</Translate>
                </Button>
              </Box>
            </>
          }
        />
        {children}
      </Box>
    </Page>
  );
};

export default Wrapper;
