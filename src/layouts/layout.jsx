import { useMemo } from "react";
import Ternary from "src/components/ternary";
import useSettings from "src/hooks/useSettings";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Horizontal from "./components/horizontal";
import Vertical from "./components/vertical";

// Paths visible only to promoters (user side)
const PROMOTER_ONLY_PATHS = ["/user/affiliate-dashboard"];

// Keywords to hide from user menu (matched against path and title)
const HIDDEN_USER_KEYWORDS = ["blog", "referal", "telegram", "my-subscription", "my_subscription"];

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
    // Hide blog, referrals, telegram for all users
    items = items.filter((item) => {
      const p = (item.path || "").toLowerCase();
      const t = (item.title || "").toLowerCase();
      return !HIDDEN_USER_KEYWORDS.some((kw) => p.includes(kw) || t.includes(kw));
    });
    // Rename "Recurring Orders" to "Abbonamenti"
    // Replace Financial dropdown with single "Il mio Wallet" link
    items = items.map((item) => {
      const p = (item.path || "").toLowerCase();
      if (p.includes("recurring-order") || p.includes("recurring_order")) {
        return { ...item, title: "Abbonamenti" };
      }
      if (p.includes("/user/financial") || (p.includes("/financial") && !p.includes("/admin"))) {
        return { ...item, title: "Il mio Wallet", path: "/user/financial/wallet", children: undefined };
      }
      if (p.includes("affiliate-dashboard") || p.includes("affiliate_dashboard")) {
        return { ...item, title: "Dashboard Bonus" };
      }
      if ((p.includes("online-store") || p.includes("online_store")) && p.includes("/user")) {
        return { ...item, title: "Ordini", path: "/user/online-store/my-orders", children: [
          { title: "I miei Ordini", path: "/user/online-store/my-orders" },
          { title: "Ordini Team", path: "/user/online-store/team-orders" },
        ]};
      }
      return item;
    });
    // Reorder: Dashboard, Dashboard Bonus, Genealogy, then rest
    const order = ["dashboard", "affiliate-dashboard", "genealog", "online-store", "coupon", "recurring", "abbonamenti", "financial", "wallet", "profile"];
    items = items.sort((a, b) => {
      const pa = (a.path || a.title || "").toLowerCase();
      const pb = (b.path || b.title || "").toLowerCase();
      const ia = order.findIndex((k) => pa.includes(k));
      const ib = order.findIndex((k) => pb.includes(k));
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
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
