import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import PackageForm from "./package-form";

const ViewPackages = () => {
  const { queryObject } = useQueryParams();

  return (
    <div>
      <Page title="coupons.user.buy.title">
        <HeaderBreadcrumbs
          heading="coupons.user.buy.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            {
              name: "coupons.user.buy.title",
              href: PATH_USER.coupons.packages,
            },
            {
              name: queryObject.name,
            },
          ]}
        />

        <PackageForm />
      </Page>
    </div>
  );
};

export default ViewPackages;
