import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const buildExtraMenuItems = (t) => [
  {
    match: "/user/financial",
    item: {
      title: t("sidebar.my_compensation_notes", "Le Mie Note di Compenso"),
      path: PATH_USER.financial.autofatture,
      placement: 5,
    },
  },
  {
    match: "/admin/financial",
    item: {
      title: t("sidebar.compensation_notes", "Note di Compenso"),
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
      title: t("sidebar.orphan_leads", "Lead Orfani"),
      path: "/admin/lead-orfani",
      placement: 22,
    },
  },
  {
    match: "/admin/financial",
    item: {
      title: t("sidebar.ivd_payments", "Pagamenti IVD-Abituali"),
      path: "/admin/payout-fatture",
      placement: 9.5,
    },
  },
];

const injectMenuItems = (menu, extraMenuItems) => {
  if (!Array.isArray(menu)) return menu;
  return menu.map((group) => {
    if (!group.items) return group;
    return {
      ...group,
      items: group.items.map((item) => {
        if (!item.path || !item.children) return item;
        let children = item.children;
        extraMenuItems.forEach(({ match, item: extra }) => {
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

// Traduce titoli menu leaf che arrivano hardcoded dal backend
// (voci del DB memorizzate in IT). Il match e' case-insensitive
// sul title normalizzato.
const RAW_TITLE_TRANSLATIONS = {
  "albero": "sidebar.tree",
  "team": "sidebar.team",
  "coupon": "user_nav.coupons.list",
  "coupons": "user_nav.coupons.list",
  "cupon": "user_nav.coupons.list",
  "cupoane": "user_nav.coupons.list",
  "i miei lead": "sidebar.my_leads",
  "abbonamenti": "sidebar.subscriptions",
  "il mio wallet": "sidebar.my_wallet",
  "ordini": "sidebar.orders",
  "i miei ordini": "sidebar.my_orders",
  "ordini team": "sidebar.team_orders",
  "dashboard bonus": "sidebar.dashboard_bonus",
  "genealogia": "sidebar.genealogy",
  "report": "sidebar.report",
  "panoramica": "sidebar.report_overview",
  "smartship": "sidebar.report_smartship",
  "community": "sidebar.community",
  "profilo": "user_nav.my_profile",
  "il mio profilo": "user_nav.my_profile",
  "centro assistenza": "user_nav.help_center.help_center",
};

const translateTitle = (t, title) => {
  if (!title || typeof title !== "string") return title;
  const key = RAW_TITLE_TRANSLATIONS[title.trim().toLowerCase()];
  return key ? t(key, title) : title;
};

const translateItemTitles = (items, t) => {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    const next = { ...item, title: translateTitle(t, item.title) };
    if (Array.isArray(item.children)) {
      next.children = translateItemTitles(item.children, t);
    }
    return next;
  });
};

const filterMenu = (menu, isPromoter, t) => {
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
      const ti = (item.title || "").toLowerCase();
      return !HIDDEN_USER_KEYWORDS.some((kw) => p.includes(kw) || ti.includes(kw));
    });
    // Rename "Recurring Orders" to "Abbonamenti"
    // Replace Financial dropdown with single "Il mio Wallet" link
    items = items.map((item) => {
      const p = (item.path || "").toLowerCase();
      if (p.includes("recurring-order") || p.includes("recurring_order")) {
        return { ...item, title: t("sidebar.subscriptions", "Abbonamenti") };
      }
      if (p.includes("/user/financial") || (p.includes("/financial") && !p.includes("/admin"))) {
        return { ...item, title: t("sidebar.my_wallet", "Il mio Wallet"), path: "/user/financial/wallet", children: undefined };
      }
      if (p.includes("affiliate-dashboard") || p.includes("affiliate_dashboard")) {
        return { ...item, title: t("sidebar.dashboard_bonus", "Dashboard Bonus") };
      }
      if ((p.includes("online-store") || p.includes("online_store")) && p.includes("/user")) {
        const orderChildren = [{ title: t("sidebar.my_orders", "I miei Ordini"), path: "/user/online-store/my-orders" }];
        if (isPromoter) orderChildren.push({ title: t("sidebar.team_orders", "Ordini Team"), path: "/user/online-store/team-orders" });
        return { ...item, title: t("sidebar.orders", "Ordini"), path: "/user/online-store/my-orders", children: orderChildren.length > 1 ? orderChildren : undefined };
      }
      return item;
    });
    // Reorder: Dashboard, Dashboard Bonus, Genealogy, then rest
    // Inject Report group (promoter only). Convertito da singola voce a
    // gruppo con children: Panoramica (income-report) + SmartShip.
    if (isPromoter && !items.some((i) => (i.path || "").includes("income-report") || (i.title === t("sidebar.report", "Report") && Array.isArray(i.children)))) {
      items.push({
        title: t("sidebar.report", "Report"),
        icon: "/icons/ic_report.svg",
        children: [
          { title: t("sidebar.report_overview", "Panoramica"), path: "/user/income-report" },
          { title: t("sidebar.report_smartship", "SmartShip"), path: "/user/smartship-report" },
        ],
      });
    } else if (isPromoter) {
      // Se income-report esiste gia' come voce top, la trasformo in gruppo
      items = items.map((item) => {
        if ((item.path || "").includes("income-report")) {
          return {
            title: t("sidebar.report", "Report"),
            icon: item.icon || "/icons/ic_report.svg",
            children: [
              { title: t("sidebar.report_overview", "Panoramica"), path: "/user/income-report" },
              { title: t("sidebar.report_smartship", "SmartShip"), path: "/user/smartship-report" },
            ],
          };
        }
        return item;
      });
    }
    // Inject Community (link diretto che apre SSO verso community.myevea.com)
    // Solo se siamo in un gruppo menu "user" — evita che compaia lato admin
    const isUserGroup = items.some((i) => (i.path || "").startsWith("/user/"));
    if (isUserGroup && !items.some((i) => (i.path || "").includes("/user/community"))) {
      items.push({ title: t("sidebar.community", "Community"), path: "/user/community", icon: "/icons/ic_member_management.svg" });
    }
    // Inject "I miei Lead" — SOLO promoter (i customer non hanno lead da
    // gestire). Modifica del 02/07/2026: prima il menu veniva iniettato per
    // qualsiasi utente user-group indipendentemente da is_promoter,
    // rendendolo visibile anche ai customer. Aggiunto isPromoter come gate.
    if (isPromoter && isUserGroup && !items.some((i) => (i.path || "").includes("/user/i-miei-lead"))) {
      items.push({ title: t("sidebar.my_leads", "I miei Lead"), path: "/user/i-miei-lead", icon: "/icons/ic_member_management.svg" });
    }
    // Genealogia customer: solo "Albero" (Team rimosso — non rilevante per
    // il cliente). Sostituisce la voce Genealogia dal menu_list DB con un
    // link diretto a /user/genealogy/sponsor (nessuna sotto-voce).
    if (isUserGroup && !isPromoter) {
      const customerGenealogy = {
        title: t("sidebar.genealogy", "Genealogia"),
        path: "/user/genealogy/sponsor",
        icon: "/icons/ic_tree.svg",
      };
      const gIdx = items.findIndex((i) => (i.path || "").startsWith("/user/genealogy"));
      if (gIdx >= 0) {
        items = items.map((it, idx) => (idx === gIdx ? customerGenealogy : it));
      } else {
        items.push(customerGenealogy);
      }
    }
    // Tesserino e lettera sono dentro onboarding/profilo
    const order = ["dashboard", "affiliate-dashboard", "genealog", "i-miei-lead", "online-store", "coupon", "recurring", "abbonamenti", "financial", "wallet", "income-report", "report", "lettera-incarico", "tesserino", "profile", "community"];
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
    // Traduzione titoli leaf che arrivano dal DB backend in italiano
    items = translateItemTitles(items, t);
    return { ...group, items };
  });
};

const Layout = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isPromoter = user?.is_promoter === 1;
  const raw = JSON.parse(localStorage.getItem("menu") || "[]");
  const isAdmin = user?.is_super_admin === 1 || user?.is_sub_admin === 1;
  const config = useMemo(() => {
    const extraMenuItems = buildExtraMenuItems(t);
    let menu = filterMenu(injectMenuItems(raw, extraMenuItems), isPromoter, t);
    // Inject Centro Controllo + Sostenibilita' for admin (subito dopo Dashboard)
    if (isAdmin && Array.isArray(menu)) {
      menu = menu.map((group) => {
        if (!group.items) return group;
        const hasDashboard = group.items.some((i) => (i.path || "").includes("/admin/dashboard"));
        if (!hasDashboard) return group;
        let items = [...group.items];
        // Centro Controllo (se non gia' presente)
        if (!items.some((i) => (i.path || "").includes("centro-controllo"))) {
          const dashIdx = items.findIndex((i) => (i.path || "").includes("/admin/dashboard"));
          items.splice(dashIdx + 1, 0, { title: t("sidebar.control_center", "Centro Controllo"), path: "/admin/centro-controllo", icon: "/icons/ic_analytics.svg" });
        }
        // Sostenibilita' Piano Compensi (04/07/2026) — subito dopo Centro Controllo
        if (!items.some((i) => (i.path || "").includes("kpi-sustainability"))) {
          const ccIdx = items.findIndex((i) => (i.path || "").includes("centro-controllo"));
          const insertAt = ccIdx >= 0 ? ccIdx + 1 : items.length;
          items.splice(insertAt, 0, { title: t("sidebar.sustainability", "Sostenibilità"), path: "/admin/kpi-sustainability", icon: "/icons/ic_analytics.svg" });
        }
        return { ...group, items };
      });
    }
    return applyIcons(menu);
    // i18n.resolvedLanguage force re-compute on locale change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, isPromoter, isAdmin, i18n.resolvedLanguage]);

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
