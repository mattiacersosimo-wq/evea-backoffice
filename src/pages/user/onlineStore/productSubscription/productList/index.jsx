import { Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import PaginationButtons from "src/components/pagination";

import { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import ProductFilter from "src/pages/user/onlineStore/productSubscription/productList/components/ProductFilter.js";
import { PATH_USER } from "src/routes/paths";
import CartWidget from "./components/cartWidget";
import ProductList from "./components/productList";
import useFilterForm from "./hooks/useFilterForm";
import useProducts from "./hooks/useProducts";

const Subscriptions = () => {
  const methods = useFilterForm();

  const { watch } = methods;
  const filter = watch();
  const { product_type } = useParams();

  const { state, filterIds, fetchData, rowStart, setFilterIds, ...rest } =
    useProducts(filter);

  const { data, ...dataProps } = state;
  const onFilter = methods.handleSubmit((inputData) =>
    fetchData(1, { ...inputData, product_type })
  );
  // const isPackage = useIsPackage();

  const title = useMemo(() => {
    if (product_type === "packages") {
      return "products.title.package";
    } else if (product_type === "subscriptions") {
      return "products.title.subscriptions";
    } else {
      return "products.title.product";
    }
  }, [product_type]);

  const { pathname } = useLocation();
  useEffect(() => {
    return () => {
      methods.reset();


    };
  }, [pathname]);
  return (
    <Page title={title}>
      <HeaderBreadcrumbs
        heading={title}
        links={[
          { name: "global.dashboard", href: PATH_USER.user_dashboard },
          { name: title },
        ]}
      />
      <FilterBar>
        <FormProvider methods={methods} onSubmit={onFilter}>
          <ProductFilter />
        </FormProvider>
      </FilterBar>
      <Card sx={{ p: 2 }}>
        <DataHandlerList dataProps={{ ...dataProps }}>
          <ProductList products={data} />
        </DataHandlerList>
      </Card>
      <PaginationButtons {...rest} />
      {/* <CartWidget /> */}
    </Page>
  );
};

export default Subscriptions;
