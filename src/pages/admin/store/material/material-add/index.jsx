import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import Form from "./components/form";

const MaterialAdd = () => {
  const links = [
    { name: "global.dashboard", href: PATH_DASHBOARD.root },
    {
      name: "material.material",
      href: "/admin/store/materials",
    },
    { name: "material.add" },
  ];

  return (
    <Page title={"material.material"}>
      <HeaderBreadcrumbs heading={"material.material"} links={links} />
      <Form />
    </Page>
  );
};

export default MaterialAdd;
