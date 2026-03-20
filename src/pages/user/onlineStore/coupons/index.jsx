import { Box } from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import { SkeletonProductItem } from "src/components/skeleton";
import Ternary from "src/components/ternary";
import { PATH_USER } from "src/routes/paths";
import PackageCouponCard from "./componenets/package-card";
import useCouponPackages from "./hooks/use-coupon-packages";

const Coupons = () => {
  const { state, filterIds, fetchData, rowStart, setFilterIds, ...rest } =
    useCouponPackages();
  const { data, ...dataProps } = state;

  return (
    <div>
      <Page title="coupons.user.buy.title">
        <HeaderBreadcrumbs
          heading="coupons.user.buy.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "coupons.user.buy.title" },
          ]}
        />
        <DataHandlerList dataProps={{ ...dataProps }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            <Map
              list={data}
              render={(product, index) => (
                <Ternary
                  when={product}
                  then={
                    <PackageCouponCard key={product?.id} product={product} />
                  }
                  otherwise={<SkeletonProductItem key={index} />}
                />
              )}
            />
          </Box>
        </DataHandlerList>
      </Page>
    </div>
  );
};

export default Coupons;
