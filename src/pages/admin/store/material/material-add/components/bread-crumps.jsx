import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

import { PATH_DASHBOARD } from "src/routes/paths";

const BreadCrumps = () => {
  return (
    <HeaderBreadcrumbs
      heading={"adminStore.material.addMaterial"}
      links={[
        { name: "dashboard", href: PATH_DASHBOARD.root },
        {
          name: "adminStore.material.materials",
          href: PATH_DASHBOARD.store.material,
        },
        { name: "adminStore.material.add" },
      ]}
    />
  );
};
export default BreadCrumps;
