import { Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import ProductForm from "../product-form";
import useAddProduct from "./hooks/use-add-product";

const ProductAdd = () => {
  const addProduct = useAddProduct();

  return (
    <Page title={"products.title.product_add"}>
      <HeaderBreadcrumbs
        heading={"products.title.product_add"}
        links={[
          { name: "dashboard", href: PATH_DASHBOARD.root },
          {
            name: "products.title.product_add",
            href: PATH_DASHBOARD.store.products,
          },
          { name: "products.title.product_add" },
        ]}
      />
      <Card sx={{ p: 3 }}>
        <ProductForm {...addProduct} />
      </Card>
    </Page>
  );
};

export default ProductAdd;
