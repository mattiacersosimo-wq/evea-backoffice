import { PLANS } from "src/CONSTANTS";
import { PATH_USER } from "src/routes/paths";
import ICONS from "./icons";

const { binary, roi, matrix, monoLine } = PLANS;

const userNavConfig = [
    {
        items: [
            {
                title: "user_nav.dashboard",
                path: PATH_USER.user_dashboard,
                icon: ICONS.dashboard,
                placement: 0,
            },
            
            {
                title: "user_nav.affiliate_dashboard",
                path: PATH_USER.affiliate_dashboard,
                icon: ICONS.affiliate_dashboard,
                placement: 1,
                promoterOnly: true,
            },

            // {
            //     title: "user_nav.join_telegram",
            //     path: "https://web.telegram.org/",
            //     icon: ICONS.chat,
            // },

            {
                title: "user_nav.online_store.online_store",
                path: PATH_USER.onlineStore.root,
                icon: ICONS.online_store,
                placement: 2,
                children: [
                    {
                        title: "user_nav.online_store.product",
                        path: PATH_USER.onlineStore.productSubscription.products
                            .root,
                        placement: 0,
                    },
                    {
                        title: "user_nav.online_store.packages",
                        path: PATH_USER.onlineStore.productSubscription.packages
                            .root,
                        placement: 0,
                    },
                    {
                        title: "user_nav.online_store.subscriptions",
                        path: PATH_USER.onlineStore.productSubscription.subscriptions
                            .root,
                        placement: 0,
                    },
                    {
                        title: "user_nav.online_store.my_orders",
                        path: PATH_USER.my_orders.root,
                        placement: 1,
                    },
                    {
                        title: "global.order_history",
                        path: PATH_USER.order_history.root,
                        placement: 1,
                    },
                    {
                        title: "global.team_orders",
                        path: PATH_USER.team_orders.root,
                        placement: 1,
                    },
                    // {
                    //   title: "coupons.coupon",
                    //   path: PATH_USER.coupon_package.root,
                    //   placement: 1,
                    // },
                    // {
                    //   title: "global.couponPurchase",
                    //   path: PATH_USER.coupon_purchase.root,
                    //   placement: 1,
                    // },
                ],
            },

            {
                title: "user_nav.coupons.title",
                placement: 3,
                path: PATH_USER.coupons.root,
                icon: ICONS.store,
                children: [
                    // {
                    //     title: "user_nav.coupons.purchase",
                    //     path: PATH_USER.coupons.packages,
                    //     placement: 0,
                    // },
                    {
                        title: "user_nav.coupons.list",
                        path: PATH_USER.coupons.list,
                        placement: 1,
                    },
                ],
            },
            {
                title: "user_nav.my_subscriptions",
                icon: ICONS.my_subscription,
                path: PATH_USER.subscriptions.root,
                placement: 4,
            },
            {
                title: "user_nav.recurring_orders",
                icon: ICONS.recurring_orders,
                path: PATH_USER.recurring_orders.root,
                placement: 5,
            },
            {
                title: "user_nav.genealogy.genealogy",
                icon: ICONS.kanban,
                path: PATH_USER.genealogy.root,
                placement: 6,
                isAffiliate: true,
                children: [
                    {
                        plans: [matrix],
                        title: "user_nav.genealogy.matrix",
                        path: PATH_USER.genealogy.matrix,
                        placement: 0,
                        isAffiliate: true,
                    },
                    {
                        plans: [monoLine],
                        title: "nav.genealogy.mono_line",
                        parent: "genealogy",
                        path: PATH_USER.genealogy.monoLine,
                        placement: 1,
                        isAffiliate: true,
                    },
                    {
                        plans: [binary, roi],
                        title: "user_nav.genealogy.binary",
                        path: PATH_USER.genealogy.binary,
                        placement: 2,
                        isAffiliate: true,
                    },
                    {
                        title: "user_nav.genealogy.sponsor",
                        path: PATH_USER.genealogy.sponsor,
                        placement: 3,
                        isAffiliate: true,
                    },
                    // {
                    //   title: "user_nav.genealogy.affiliate_dashboard",
                    //   path: PATH_USER.genealogy.affiliate,
                    //   placement: 4,
                    // },
                    {
                        title: "user_nav.genealogy.tree",
                        path: PATH_USER.genealogy.tree,
                        placement: 5,
                        isAffiliate: true,
                    },
                    {
                        title: "user_nav.genealogy.list",
                        path: PATH_USER.genealogy.list,
                        placement: 5,
                        isAffiliate: true,
                    },
                    {
                        plans: [roi, binary],
                        title: "user_nav.genealogy.binary_leg_settings",
                        path: PATH_USER.genealogy.binaryLeg,
                        placement: 6,
                        isAffiliate: true,
                    },
                ],
            },
            // {
            //     title: "user_nav.referals",
            //     icon: ICONS.referrals,
            //     path: PATH_USER.referals.root,
            //     placement: 7,
            //     isAffiliate: true,
            // },
            
            {
                title: "user_nav.financial.financial",
                path: PATH_USER.financial.root,
                icon: ICONS.ecommerce,
                placement: 8,
                isAffiliate: true,
                children: [
                    {
                        title: "user_nav.financial.my_eWallet",
                        path: PATH_USER.financial.eWallet,
                        placement: 0,
                        isAffiliate: true,
                    },
                    {
                        title: "user_nav.financial.deposit_wallet",
                        path: PATH_USER.financial.depositWallet,
                        placement: 1,
                    },
                    {
                        title: "user_nav.financial.fund_transfer",
                        path: PATH_USER.financial.fundsTransfer,
                        placement: 2,
                        isAffiliate: true,
                    },
                    {
                        title: "user_nav.financial.request_payout",
                        path: PATH_USER.financial.payout,
                        placement: 3,
                        isAffiliate: true,
                    },
                    {
                        title: "user_nav.pendingcommissions",
                        path: PATH_USER.financial.pendingcommissions,
                        placement: 4,
                    },
                    {
                        title: "Le Mie Autofatture",
                        path: PATH_USER.financial.autofatture,
                        placement: 5,
                    },
                ],
            },
            // {
            //   title: "user_nav.business_builder.business_builder",
            //   icon: ICONS.business_builder,
            //   path: PATH_USER.business_builder.root,
            //   placement: 5,
            //   children: [
            //     {
            //       title: "user_nav.business_builder.subscriptions",
            //       path: PATH_USER.business_builder.subscriptions,
            //       placement: 0,
            //     },
            //     {
            //       title: "user_nav.business_builder.materials",
            //       path: PATH_USER.business_builder.materials.root,
            //       placement: 1,
            //     },
            //   ],
            // },
            {
                title: "user_nav.my_profile",
                icon: ICONS.profile,
                path: PATH_USER.profile.root,
                placement: 9,
            },
            // {
            //     title: "user_nav.blogs",
            //     icon: ICONS.blog,
            //     path: PATH_USER.blogs.root,
            //     placement: 10,
            // },
            {
                title: "user_nav.help_center.help_center",
                path: PATH_USER.helpCenter.root,
                icon: ICONS.help_center,
                placement: 11,
                children: [
                    {
                        title: "user_nav.help_center.faqs",
                        path: PATH_USER.helpCenter.faq.root,
                        placement: 0,
                    },
                    {
                        title: "user_nav.help_center.knowledge_base",
                        path: PATH_USER.helpCenter.knowledgeBase.root,
                        placement: 1,
                    },
                    {
                        title: "user_nav.help_center.emails",
                        path: PATH_USER.helpCenter.mails.inbox,
                        placement: 2,
                    },
                    {
                        title: "user_nav.help_center.support_tickets",
                        path: PATH_USER.helpCenter.createTicket.view,
                        placement: 3,
                    },
                    {
                        title: "user_nav.help_center.documents",
                        path: PATH_USER.helpCenter.documents,
                        placement: 4,
                    },
                    {
                        title: "user_nav.help_center.videos",
                        path: PATH_USER.helpCenter.videos,
                        placement: 5,
                    },
                ],
            },
            // {
            //   title: "user_nav.income_report",
            //   path: PATH_USER.incomeReport.root,
            //   icon: ICONS.report,
            //   placement: 9,
            // },
            {
                title: "user_nav.leads",
                path: PATH_USER.leads.root,
                icon: ICONS.leads,
                isLead: true,
                placement: 12,
            },
        ],
    },
];

export default userNavConfig;
