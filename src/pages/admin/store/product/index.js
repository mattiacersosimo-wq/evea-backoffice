import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { useMemo } from "react";
import { useParams } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import HeaderActions from "./HeaderActions";
import ProductList from "./ProductList";

const Index = () => {
  const { product_type } = useParams();

  const title = useMemo(() => {
    if (product_type === "packages") {
      return "products.title.package";
    } else if (product_type === "subscriptions") {
      return "products.title.subscriptions";
    } else {
      return "products.title.product";
    }
  }, [product_type]);

  return (
    <div>
      <Page title={title}>
        <Box>
          <HeaderBreadcrumbs
            heading={title}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: title },
            ]}
            // action={<HeaderActions />}
          />
          <ProductList />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
