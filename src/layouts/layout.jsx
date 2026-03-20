import { useMemo } from "react";
import Ternary from "src/components/ternary";
import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Horizontal from "./components/horizontal";
import Vertical from "./components/vertical";

const EXTRA_MENU_ITEMS = [
  {
    match: "/user/financial",
    item: {
      title: "Le Mie Autofatture",
      path: PATH_USER.financial.autofatture,
      placement: 5,
    },
  },
  {
    match: "/admin/financial",
    item: {
      title: "Autofatture",
      path: PATH_DASHBOARD.financial.autofatture,
      placement: 9,
    },
  },
];

const injectMenuItems = (menu) => {
  if (!Array.isArray(menu)) return menu;
  return menu.map((group) => {
    if (!group.items) return group;
    return {
      ...group,
      items: group.items.map((item) => {
        if (!item.path || !item.children) return item;
        let children = item.children;
        EXTRA_MENU_ITEMS.forEach(({ match, item: extra }) => {
          if (!item.path.includes(match)) return;
          if (children.some((c) => c.path === extra.path)) return;
          children = [...children, extra];
        });
        return children === item.children
          ? item
          : { ...item, children };
      }),
    };
  });
};

const Layout = () => {
  const raw = JSON.parse(localStorage.getItem("menu") || "[]");
  const config = useMemo(() => injectMenuItems(raw), [raw]);

  const { themeLayout } = useSettings();
  const verticalLayout = themeLayout === "vertical";

  return (
    <Ternary
      when={verticalLayout}
      then={<Vertical navConfig={config} />}
      otherwise={<Horizontal navConfig={config} />}
    />
  );
};
export default Layout;
