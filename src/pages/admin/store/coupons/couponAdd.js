import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import Form from "./Form";
import useAddCoupon from "./hooks/useAddCoupon";

const CouponAdd = () => {
  const addCoupon = useAddCoupon();

  return (
    <>
      <Page title={"coupons.add_coupon_title"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"coupons.add_coupon"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "coupons.coupon",
                href: PATH_DASHBOARD.store.coupons,
              },
              { name: "coupons.add" },
            ]}
          />

          <Form {...addCoupon} />
        </Box>
      </Page>
    </>
  );
};

export default CouponAdd;
