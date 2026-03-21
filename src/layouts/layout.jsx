import { useMemo } from "react";
import Ternary from "src/components/ternary";
import useSettings from "src/hooks/useSettings";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Horizontal from "./components/horizontal";
import Vertical from "./components/vertical";

// Paths visible only to promoters (user side)
const PROMOTER_ONLY_PATHS = ["/user/affiliate-dashboard"];

// Admin dashboard children to remove (business/network replaced by KPI)
const HIDDEN_ADMIN_CHILDREN = ["/admin/dashboard/business", "/admin/dashboard/network"];

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

const filterMenu = (menu, isPromoter) => {
  if (!Array.isArray(menu)) return menu;
  return menu.map((group) => {
    if (!group.items) return group;
    let items = group.items;
    // Hide affiliate-dashboard for customers
    if (!isPromoter) {
      items = items.filter((item) => !PROMOTER_ONLY_PATHS.includes(item.path));
    }
    // Remove business/network children from admin dashboard
    items = items.map((item) => {
      if (!item.children) return item;
      const filtered = item.children.filter((c) => !HIDDEN_ADMIN_CHILDREN.includes(c.path));
      // If all children removed, make it a direct link (no dropdown)
      return filtered.length === 0 ? { ...item, children: undefined } : { ...item, children: filtered };
    });
    return { ...group, items };
  });
};

const Layout = () => {
  const { user } = useAuth();
  const isPromoter = user?.is_promoter === 1;
  const raw = JSON.parse(localStorage.getItem("menu") || "[]");
  const config = useMemo(() => filterMenu(injectMenuItems(raw), isPromoter), [raw, isPromoter]);

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
