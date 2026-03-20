import { Link as RouterLink } from "react-router-dom";

import { Box, Button, useMediaQuery } from "@mui/material";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import { default as Page } from "src/components/Page";
import Ternary from "src/components/ternary";

import { isMenuActive } from "src/utils/actionProtector";
import CouponList from "./couponList";
import Translate from "src/components/translate";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    remove: test("delete"),
  };
};

const Index = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const { add, ...status } = genStatus("nav.store.title", "nav.store.coupons");

  return (
    <div>
      <Page title={"coupons.coupon_title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"coupons.coupon"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "coupons.coupon" },
            ]}
            action={
              <Ternary
                when={add}
                then={
                  <Button
                    {...buttonProps}
                    component={RouterLink}
                    to={PATH_DASHBOARD.store.coupons_add}
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"eva:plus-fill"} />}
                    name="add"
                  >
                    <Translate>coupons.add_coupon</Translate>
                  </Button>
                }
              />
            }
          />

          <CouponList status={status} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
