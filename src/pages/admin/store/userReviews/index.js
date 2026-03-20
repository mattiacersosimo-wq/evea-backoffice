import { Box, Button, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import ReviewList from "./reviewsList";
import Translate from "src/components/translate";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    view: test("view"),
  };
};

const Index = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const { add, view } = genStatus("nav.store.title", "nav.store.user_review");

  return (
    <div>
      <Page title={"user_review.user_review_title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"user_review.user_review"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "user_review.user_review" },
            ]}
            action={
              <Ternary
                when={add}
                then={
                  <Button
                    {...buttonProps}
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"eva:plus-fill"} />}
                    component={RouterLink}
                    to={PATH_DASHBOARD.store.user_reviews_add}
                    name="add"
                  >
                    <Translate>user_review.add_review</Translate>
                  </Button>
                }
              />
            }
          />
          <ReviewList view={view} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
