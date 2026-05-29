import { useMemo } from "react";
import Ternary from "src/components/ternary";
import useSettings from "src/hooks/useSettings";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Horizontal from "./components/horizontal";
import Vertical from "./components/vertical";
import AiChat from "src/components/ai-chat";

// Paths visible only to promoters (user side)
const PROMOTER_ONLY_PATHS = ["/user/affiliate-dashboard", "/user/online-store/team-orders"];

// Keywords to hide from user menu (matched against path and title)
const HIDDEN_USER_KEYWORDS = ["blog", "referal", "telegram", "my-subscription", "my_subscription"];

// Admin dashboard children to remove (business/network replaced by KPI)
const HIDDEN_ADMIN_CHILDREN = ["/admin/dashboard/business", "/admin/dashboard/network"];

// Help Center children to KEEP (solo queste sezioni)
const HELP_CENTER_KEEP = ["faq", "support", "ticket", "documents", "videos", "video"];

// Icon override map — path keyword → SVG file path (from public/icons/)
// Bypasses localStorage-cached icons from legacy menu config
const ICON_MAP = {
  "dashboard-bonus": "/icons/ic_affiliate_dashboard.svg",
  "affiliate-dashboard": "/icons/ic_affiliate_dashboard.svg",
  "centro-controllo": "/icons/ic_analytics.svg",
  "genealog": "/icons/ic_tree.svg",
  "online-store": "/icons/ic_ecommerce.svg",
  "my-orders": "/icons/ic_ecommerce.svg",
  "ordini": "/icons/ic_ecommerce.svg",
  "coupon": "/icons/ic_store.svg",
  "recurring-order": "/icons/ic_recurring_orders.svg",
  "abbonamenti": "/icons/ic_recurring_orders.svg",
  "financial": "/icons/ic_banking.svg",
  "wallet": "/icons/ic_banking.svg",
  "income-report": "/icons/ic_report.svg",
  "report": "/icons/ic_report.svg",
  "dashboard": "/icons/ic_dashboard.svg",
  "profile": "/icons/ic_profile.svg",
  "help": "/icons/ic_helpcenter.svg",
  "settings": "/icons/ic_settings.svg",
  "member": "/icons/ic_member_management.svg",
  "store": "/icons/ic_ecommerce.svg",
  "holding": "/icons/ic_holdingtank.svg",
  "lettera": "/icons/ic_invoice.svg",
  "tesserino": "/icons/ic_profile.svg",
  "move-user": "/icons/ic_member_management.svg",
  "compliance": "/icons/ic_analytics.svg",
  "autofatture": "/icons/ic_invoice.svg",
  "community": "/icons/ic_member_management.svg",
};

const DEFAULT_ICON = "/icons/ic_dashboard.svg";

const resolveIcon = (item) => {
  const p = (item.path || "").toLowerCase();
  const t = (item.title || "").toLowerCase();
  for (const [kw, icon] of Object.entries(ICON_MAP)) {
    if (p.includes(kw) || t.includes(kw)) return icon;
  }
  const existing = item.icon;
  // Keep existing only if it's already a local SVG path; otherwise fallback
  if (typeof existing === "string" && existing.startsWith("/")) return existing;
  return DEFAULT_ICON;
};

const applyIconsToItems = (items) => {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    const next = { ...item, icon: resolveIcon(item) };
    if (Array.isArray(item.children)) {
      next.children = applyIconsToItems(item.children);
    }
    return next;
  });
};

const applyIcons = (menu) => {
  if (!Array.isArray(menu)) return menu;
  return menu.map((group) => ({
    ...group,
    items: applyIconsToItems(group.items || []),
  }));
};

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
  {
    match: "/admin/settings",
    item: {
      title: "nav.tools.move_user",
      path: "/admin/move-user",
      placement: 20,
    },
  },
  {
    match: "/admin/settings",
    item: {
      title: "nav.tools.compliance",
      path: "/admin/compliance",
      placement: 21,
    },
  },
  {
    match: "/admin/settings",
    item: {
      title: "Lead Orfani",
      path: "/admin/lead-orfani",
      placement: 22,
    },
  },
  {
    match: "/admin/settings",
    item: {
      title: "Payout Fatture",
      path: "/admin/payout-fatture",
      placement: 23,
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
        const orderChildren = [{ title: "I miei Ordini", path: "/user/online-store/my-orders" }];
        if (isPromoter) orderChildren.push({ title: "Ordini Team", path: "/user/online-store/team-orders" });
        return { ...item, title: "Ordini", path: "/user/online-store/my-orders", children: orderChildren.length > 1 ? orderChildren : undefined };
      }
      return item;
    });
    // Reorder: Dashboard, Dashboard Bonus, Genealogy, then rest
    // Inject Income Report if not present (promoter only)
    if (isPromoter && !items.some((i) => (i.path || "").includes("income-report"))) {
      items.push({ title: "income_report", path: "/user/income-report", icon: "/icons/ic_report.svg" });
    }
    // Rename income_report to Report
    items = items.map((item) => {
      if ((item.path || "").includes("income-report")) {
        return { ...item, title: "Report" };
      }
      return item;
    });
    // Inject Community (link diretto che apre SSO verso community.myevea.com)
    // Solo se siamo in un gruppo menu "user" — evita che compaia lato admin
    const isUserGroup = items.some((i) => (i.path || "").startsWith("/user/"));
    if (isUserGroup && !items.some((i) => (i.path || "").includes("/user/community"))) {
      items.push({ title: "Community", path: "/user/community", icon: "/icons/ic_member_management.svg" });
    }
    // Inject "I miei Lead" — solo lato user, posizione decisa dall'order sotto
    if (isUserGroup && !items.some((i) => (i.path || "").includes("/user/i-miei-lead"))) {
      items.push({ title: "I miei Lead", path: "/user/i-miei-lead", icon: "/icons/ic_member_management.svg" });
    }
    // Tesserino e lettera sono dentro onboarding/profilo
    const order = ["dashboard", "affiliate-dashboard", "genealog", "i-miei-lead", "online-store", "coupon", "recurring", "abbonamenti", "financial", "wallet", "income-report", "lettera-incarico", "tesserino", "profile", "community"];
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
    // Help Center: keep only FAQ, Support Tickets, Documents, Videos
    items = items.map((item) => {
      const p = (item.path || "").toLowerCase();
      if (!item.children || !p.includes("help")) return item;
      const filtered = item.children.filter((c) => {
        const cp = (c.path || "").toLowerCase();
        const ct = (c.title || "").toLowerCase();
        return HELP_CENTER_KEEP.some((kw) => cp.includes(kw) || ct.includes(kw));
      });
      return { ...item, children: filtered };
    });
    // Flatten single-child dropdowns (es. Coupon con solo "Lista coupon")
    items = items.map((item) => {
      if (!item.children || item.children.length !== 1) return item;
      const only = item.children[0];
      return { ...item, path: only.path || item.path, children: undefined };
    });
    return { ...group, items };
  });
};

const Layout = () => {
  const { user } = useAuth();
  const isPromoter = user?.is_promoter === 1;
  const raw = JSON.parse(localStorage.getItem("menu") || "[]");
  const isAdmin = user?.is_super_admin === 1 || user?.is_sub_admin === 1;
  const config = useMemo(() => {
    let menu = filterMenu(injectMenuItems(raw), isPromoter);
    // Inject Centro Controllo for admin
    if (isAdmin && Array.isArray(menu)) {
      menu = menu.map((group) => {
        if (!group.items) return group;
        const hasDashboard = group.items.some((i) => (i.path || "").includes("/admin/dashboard"));
        if (hasDashboard && !group.items.some((i) => (i.path || "").includes("centro-controllo"))) {
          const dashIdx = group.items.findIndex((i) => (i.path || "").includes("/admin/dashboard"));
          const items = [...group.items];
          items.splice(dashIdx + 1, 0, { title: "Centro Controllo", path: "/admin/centro-controllo", icon: "/icons/ic_analytics.svg" });
          return { ...group, items };
        }
        return group;
      });
    }
    return applyIcons(menu);
  }, [raw, isPromoter, isAdmin]);

  const { themeLayout } = useSettings();
  const verticalLayout = themeLayout === "vertical";

  return (
    <>
      <Ternary
        when={verticalLayout}
        then={<Vertical navConfig={config} />}
        otherwise={<Horizontal navConfig={config} />}
      />
      {/* <AiChat /> nascosto temporaneamente — riattivare quando pronto */}
    </>
  );
};
export default Layout;
