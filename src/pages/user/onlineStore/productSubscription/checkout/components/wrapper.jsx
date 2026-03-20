import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";

const Wrapper = ({ children }) => {
  return (
    <Page title={"userOnlineStore.CheckoutTitile"}>
      <HeaderBreadcrumbs
        heading={"userOnlineStore.checkout"}
        links={[
          { name: "dashboard", href: PATH_USER.root },
          {
            name: "userOnlineStore.productSubscription",
            href: PATH_USER.onlineStore.productSubscription.root,
          },
          { name: "userOnlineStore.checkout" },
        ]}
      />
      {children}
    </Page>
  );
};

export default Wrapper;
