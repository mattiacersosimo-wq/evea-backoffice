import { PLANS } from "src/CONSTANTS";
import { PATH_DASHBOARD } from "src/routes/paths";
import ICONS from "./icons";

const { binary, roi, matrix, monoLine } = PLANS;

const adminNavConfig = [
  {
    items: [
      {
        title: "nav.dashboard.title",
        path: PATH_DASHBOARD.dashboard.root,
        icon: ICONS.dashboard,
        placement: 1,
        children: [
          {
            title: "nav.dashboard.business",
            parent: "nav.dashboard.title",
            path: PATH_DASHBOARD.dashboard.business,
            placement: 0,
          },
          {
            title: "nav.dashboard.network",
            parent: "nav.dashboard.title",
            path: PATH_DASHBOARD.dashboard.network,
            placement: 1,
          },
        ],
      },

      {
        title: "nav.genealogy.title",
        parent: "nav.genealogy.title",
        path: PATH_DASHBOARD.genealogy.root,
        icon: ICONS.kanban,
        placement: 2,
        children: [
          {
            plans: [matrix],
            title: "nav.genealogy.matrix",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.matrix,
            placement: 0,
          },
          {
            plans: [monoLine],
            title: "nav.genealogy.mono_line",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.monoLine,
            placement: 1,
          },
          {
            plans: [binary, roi],
            title: "nav.genealogy.binary",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.binary,
            placement: 2,
          },
          {
            title: "nav.genealogy.sponsor",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.sponsor,
            placement: 3,
          },
          {
            title: "nav.genealogy.tree",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.tree,
            placement: 4,
          },
          {
            title: "nav.genealogy.list",
            parent: "nav.genealogy.title",
            path: PATH_DASHBOARD.genealogy.list,
            placement: 5,
          },
        ],
      },

      {
        title: "nav.financial.title",
        path: PATH_DASHBOARD.financial.root,
        icon: ICONS.ecommerce,
        placement: 3,
        children: [
          {
            title: "nav.financial.e_wallet",
            parent: "nav.financial.title",
            path: PATH_DASHBOARD.financial.ewallet,
            placement: 0,
          },
          {
            title: "nav.financial.d_wallet",
            parent: "nav.financial.title",
            path: PATH_DASHBOARD.financial.deposit_wallet,
            placement: 1,
          },
          {
            title: "nav.financial.fund_credit",
            parent: "nav.financial.title",
            path: PATH_DASHBOARD.financial.fund_credits,
            placement: 2,
            actions: ["add", "deduct"],
          },
          {
            title: "nav.financial.payout",
            parent: "nav.financial.title",
            path: PATH_DASHBOARD.financial.payout,
            placement: 3,
            actions: ["reject", "approve"],
          },
          {
            title: "nav.financial.pendingcommission",
            parent: "nav.financial.title",
            path: PATH_DASHBOARD.financial.pendingcommission,
            placement: 4,
            actions: ["reject", "approve"],
          },
        ],
      },
      {
        title: "nav.pendingranks.title",
        path: PATH_DASHBOARD.pendingranks.root,
        icon: ICONS.leads,
        placement: 4,
      },

      {
        title: "nav.communication.title",
        path: PATH_DASHBOARD.communication.root,
        icon: ICONS.chat,
        placement: 4,
        children: [
          {
            title: "nav.communication.blog",
            parent: "nav.communication.title",
            path: PATH_DASHBOARD.communication.blog,
            placement: 0,
            actions: ["add", "category", "edit", "delete", "draft", "publish"],
          },
          {
            title: "nav.communication.faqs",
            parent: "nav.communication.title",
            path: PATH_DASHBOARD.communication.com_faqs,
            placement: 1,
            actions: [
              "add-faq",
              "edit-faq",
              "delete-faq",
              "category",
              "add-category",
              "edit-category",
              "delete-category",
            ],
          },
          {
            title: "nav.communication.mails",
            parent: "nav.communication.title",
            path: PATH_DASHBOARD.communication.mails,
            placement: 2,
            actions: ["send", "delete"],
          },
          {
            title: "nav.communication.help_center",
            parent: "nav.communication.title",
            path: PATH_DASHBOARD.communication.help_center,
            placement: 3,
            actions: [
              "create-ticket",
              "update-ticket-status",
              "view-ticket",
              "reply-ticket",
              "impersonate-ticket",
              "edit-ticket",
              "delete-ticket",
              "add-department",
              "edit-department",
              "delete-department",
              "add-categories",
              "edit-categories",
              "delete-categories",
              "add-canned",
              "edit-canned",
              "delete-canned",
              "add-priorities",
              "edit-priorities",
              "delete-priorities",
            ],
          },
          {
            title: "nav.communication.article",
            parent: "nav.communication.title",
            path: PATH_DASHBOARD.communication.com_article,
            placement: 4,
            actions: [
              "add-article",
              "edit-article",
              "delete-article",
              "add-category",
              "edit-category",
              "delete-category",
            ],
          },
        ],
      },

      {
        title: "nav.tools.title",
        path: PATH_DASHBOARD.tools.root,
        icon: ICONS.tools,
        placement: 5,
        children: [
          {
            title: "nav.tools.documents",
            parent: "nav.tools.title",
            path: PATH_DASHBOARD.tools.documents,
            placement: 0,
            actions: ["add", "edit", "delete"],
          },
          {
            title: "nav.tools.videos",
            parent: "nav.tools.title",
            path: PATH_DASHBOARD.tools.videos,
            placement: 1,
            actions: ["add", "edit", "delete"],
          },
        ],
      },

      {
        title: "nav.members.title",
        path: PATH_DASHBOARD.members.root,
        icon: ICONS.member_management,
        placement: 6,
        children: [
          {
            title: "nav.members.network",
            parent: "nav.members.title",
            path: PATH_DASHBOARD.members.network,
            placement: 0,
          },
          {
            title: "nav.members.holding",
            parent: "nav.members.title",
            path: PATH_DASHBOARD.members.holdingTank,
            placement: 1,
            actions: ["add"],
          },
          {
            title: "nav.members.kyc_details",
            isKyc: true,
            parent: "nav.members.title",
            path: PATH_DASHBOARD.members.kyc_details,
            placement: 2,
            actions: ["approve", "reject", "edit", "download"],
          },
        ],
      },

      {
        disabled: true,
        title: "nav.sub_admin.title",
        path: PATH_DASHBOARD.subAdmin.root,
        icon: ICONS.subadmin,
        children: [
          {
            title: "nav.sub_admin.sub_admins",
            path: PATH_DASHBOARD.subAdmin.sub_admins,
          },
        ],
      },
      {
        title: "nav.store.title",
        path: PATH_DASHBOARD.store.root,
        icon: ICONS.store,
        placement: 8,
        children: [
          {
            title: "nav.store.products",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.products,
            placement: 0,
            actions: [
              "add-product",
              "add-category",
              "view-edit-video",
              "view-edit-document",
              "view-edit-questions",
              "view-edit-sampledocument",
              "view-edit-product",
              "delete",
            ],
          },

          {
            title: "nav.store.packages",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.packages,
            placement: 1,
            actions: [
              "add-package",
              "add-category",
              "view-edit-video",
              "view-edit-document",
              "view-edit-questions",
              "view-edit-sampledocument",
              "view-edit-product",
              "delete",
            ],
          },
          {
            title: "nav.store.subscriptions",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.subscriptions,
            placement: 2,
            actions: [
                "add-package",
                "add-category",
                "view-edit-video",
                "view-edit-document",
                "view-edit-questions",
                "view-edit-sampledocument",
                "view-edit-product",
                "delete",
            ],
        },

          // {
          //   title: "nav.store.materials",
          //   parent: "nav.store.title",
          //   path: PATH_DASHBOARD.store.material,
          //   placement: 1,
          //   actions: [
          //     "add-category",
          //     "add-material",
          //     "view-material",
          //     "view-document",
          //     "edit-document",
          //     "delete-document",
          //     "edit-video",
          //     "delete-video",
          //   ],
          // },
          {
            title: "nav.store.events",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.events,
            placement: 2,
            actions: ["add", "edit", "delete"],
          },
          {
            title: "nav.store.coupons",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.coupons,
            placement: 3,
            actions: ["add", "edit", "delete"],
          },
          {
            title: "nav.store.user_review",
            parent: "nav.store.title",
            path: PATH_DASHBOARD.store.user_reviews,
            placement: 4,
            actions: ["add", "edit", "delete", "view"],
          },

          // {
          //   title: "nav.store.assign",
          //   parent: "nav.store.title",
          //   path: PATH_DASHBOARD.store.assign_subscriptions,
          //   placement: 5,
          //   actions: [
          //     "add-product",
          //     "edit-product",
          //     "delete-product",
          //     "add-category",
          //     "edit-category",
          //     "delete-category",
          //   ],
          // },
          // {
          //   title: "nav.store.bb_sales",
          //   parent: "store",
          //   path: PATH_DASHBOARD.store.business_builder_subscriptions,
          //   placement: 6,
          // },

          {
            title: "global.OrderApproval",
            path: PATH_DASHBOARD.store.orderApproval,
            icon: ICONS.tools,
            placement: 5,
            actions: ["approve", "delete"],
          },
          {
            title: "nav.my_orders.completed_orders",
            path: PATH_DASHBOARD.store.invoices,
            parent: "nav.store.title",
            placement: 5,
          },
        ],
      },

      {
        title: "nav.settings.title",
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.settings,
        placement: 9,
        children: [
          {
            title: "nav.settings.brand",
            parent: "nav.settings.title",
            path: PATH_DASHBOARD.settings.brand,
            placement: 0,
          },
          // {
          //   title: "nav.settings.bb",
          //   parent: "settings",
          //   path: PATH_DASHBOARD.settings.business,
          //   placement: 1,
          // },
          {
            title: "nav.settings.network",
            parent: "nav.settings.title",
            path: PATH_DASHBOARD.settings.network.root,
            placement: 2,
          },
          {
            title: "nav.settings.withdrawal",
            parent: "nav.settings.title",
            path: PATH_DASHBOARD.settings.withdrawal,
            placement: 3,
          },
          {
            title: "nav.settings.mail",
            parent: "nav.settings.title",
            path: PATH_DASHBOARD.settings.email_settings.root,
            placement: 5,
          },
          {
            title: "nav.settings.advanced",
            parent: "nav.settings.title",
            path: PATH_DASHBOARD.settings.advanced,
            placement: 6,
          },
        ],
      },

      {
        title: "nav.reports.title",
        path: PATH_DASHBOARD.report.root,
        icon: ICONS.report,
        placement: 10,
        children: [
          // {
          //   title: "nav.reports.builder",
          //   parent: "reports",
          //   path: PATH_DASHBOARD.report.builder,
          //   placement: 0,
          // },
          {
            title: "nav.reports.fund_credit",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.fund_credit,
            placement: 1,
          },
          {
            title: "nav.reports.joining",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.joining,
            placement: 2,
          },
          {
            title: "nav.reports.members",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.member_income,
            placement: 3,
          },
          {
            title: "nav.reports.payout",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.payout_report,
            placement: 4,
          },
          {
            plans: [binary, roi],
            title: "nav.reports.point",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.point_history,
            placement: 5,
          },
          {
            title: "nav.reports.sales",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.sales_report,
            placement: 6,
          },
          {
            title: "nav.reports.top",
            parent: "nav.reports.title",
            path: PATH_DASHBOARD.report.top_earners,
            placement: 7,
          },
        ],
      },

      {
        title: "nav.leads.title",
        isLead: true,
        path: PATH_DASHBOARD.leads.root,
        icon: ICONS.leads,
        placement: 11,
      },
    ],
  },
];

export default adminNavConfig;
