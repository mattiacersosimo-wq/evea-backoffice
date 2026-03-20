import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const HeaderCrumps = ({ name, showCategory, showAdd }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  return (
    <HeaderBreadcrumbs
      heading={name}
      links={[
        { name: "global.dashboard", href: PATH_DASHBOARD.root },
        { name: name },
      ]}
      action={
        <>
          <Stack direction="row" spacing={1}>
            <Ternary
              when={showAdd}
              then={
                <Button
                  {...buttonProps}
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                  component={RouterLink}
                  to={PATH_DASHBOARD.communication.newBlog}
                  name="create-post"
                >
                  <Translate>blogs.create.new_post</Translate>
                </Button>
              }
            />

            <Ternary
              when={showCategory}
              then={
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.communication.blogCategories}
                  variant="contained"
                  startIcon={<Iconify icon={"carbon:categories"} />}
                  name="create-category"
                >
                  <Translate>blogs.create.categories</Translate>
                </Button>
              }
            />
          </Stack>
        </>
      }
    />
  );
};

export default HeaderCrumps;
