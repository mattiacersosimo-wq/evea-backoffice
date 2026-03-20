import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";
import usePackageInCart from "../hooks/use-package-in-cart";

const Wrapper = ({ children }) => {
  const isPackage = usePackageInCart();
  return (
    <Page title={"user.online_store.product.checkout"}>
      <HeaderBreadcrumbs
        sx={{ ml: 1 }}
        heading={"user.online_store.product.checkout"}
        links={[
          { name: "global.dashboard", href: PATH_USER.root },
          {
            name: isPackage
              ? "user.online_store.package.title"
              : "user.online_store.product.title",
            href: isPackage
              ? PATH_USER.onlineStore.productSubscription.packages.root
              : PATH_USER.onlineStore.productSubscription.products.root,
          },
          { name: "user.online_store.product.checkout" },
        ]}
      />
      {children}
    </Page>
  );
};

export default Wrapper;
