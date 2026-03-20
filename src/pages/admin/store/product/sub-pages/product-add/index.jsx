import { Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { useTranslation } from "react-i18next";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import { PATH_DASHBOARD } from "src/routes/paths";
import ProductForm from "../product-form";
import useAddProduct from "./hooks/use-add-product";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const ProductAdd = () => {
  const addProduct = useAddProduct();
  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();

  const title = isPackage
    ? "products.title.package_add"
    : isSubscription
    ? "products.title.subscription_add"
    : "products.title.product_add";

  const heading = isPackage
    ? "global.package_add"
    : isSubscription
    ? "products.title.subscription_add"
    : "products.title.product_add";
  const subheading = isPackage
    ? "global.package"
    : isSubscription
    ? "global.subscription"
    : "global.product_other";
  const hrefSubheading = isPackage
    ? PATH_DASHBOARD.store.packages
    : isSubscription
    ? PATH_DASHBOARD.store.subscriptions
    : PATH_DASHBOARD.store.products;
  const { t } = useTranslation();
  return (
    <Page title={t(title)}>
      <HeaderBreadcrumbs
        heading={heading}
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          {
            name: subheading,
            href: hrefSubheading,
          },
          { name: "products.title.add" },
        ]}
      />
      <Card sx={{ p: 3 }}>
        <ProductForm {...addProduct} />
      </Card>
    </Page>
  );
};

export default ProductAdd;
