import buildPath from "src/utils/build-path";
import objectToQueryString from "src/utils/object-to-query-string";
import squashPathAndQueryString from "src/utils/squash-path-and-query-string";

export function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/admin";
const ROOTS_USER = "/user";

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  register: path(ROOTS_AUTH, "/register"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  verify: path(ROOTS_AUTH, "/verify"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newpassword: path(ROOTS_AUTH, "/new-password"),
  leadCapture: path(ROOTS_AUTH, "lead-capture"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  page404: "/404",
  page500: "/500",
  components: "/components",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  activeSubscriptions: {
    root: path(ROOTS_DASHBOARD, "/subscriptions/user"),
  },
  statistics: {
    root: path(ROOTS_DASHBOARD, "/statistics"),
    subscriptions_users: path(
      ROOTS_DASHBOARD,
      "/statistics/subscriptions_users"
    ),
    profile_user: path(ROOTS_DASHBOARD, "/statistics/profile_user"),
  },

  general: {
    app: path(ROOTS_DASHBOARD, "/dashboard"),
    ecommerce: path(ROOTS_DASHBOARD, "/ecommerce"),
    analytics: path(ROOTS_DASHBOARD, "/analytics"),
    banking: path(ROOTS_DASHBOARD, "/banking"),
    booking: path(ROOTS_DASHBOARD, "/booking"),
    home: path(ROOTS_DASHBOARD, "/home"),
    test: path(ROOTS_DASHBOARD, "/test"),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, "/communication/mails"),
    all: path(ROOTS_DASHBOARD, "/communication/mails/all"),
    replay: (id) => path(ROOTS_DASHBOARD, `/communication/mails/replay/${id}`),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, "/chat"),
    new: path(ROOTS_DASHBOARD, "/chat/new"),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, "/calendar"),
  kanban: path(ROOTS_DASHBOARD, "/kanban"),
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    new: path(ROOTS_DASHBOARD, "/user/new"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    cards: path(ROOTS_DASHBOARD, "/user/cards"),
    profile: path(ROOTS_DASHBOARD, "/profile"),
    account: path(ROOTS_DASHBOARD, "/account"),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, "/e-commerce"),
    shop: path(ROOTS_DASHBOARD, "/e-commerce/shop"),
    list: path(ROOTS_DASHBOARD, "/e-commerce/list"),
    new: path(ROOTS_DASHBOARD, "/e-commerce/product/new"),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-blazer-low-77-vintage/edit"
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-air-force-1-ndestrukt"
    ),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, "/invoice"),
    list: path(ROOTS_DASHBOARD, "/invoice/list"),
    new: path(ROOTS_DASHBOARD, "/invoice/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      "/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit"
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      "/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5"
    ),
  },

  invoices: {
    root: path(ROOTS_DASHBOARD, "/invoices"),
    view: (id) => path(ROOTS_DASHBOARD, `/invoices/${id}`),
  },

  blog: {
    root: path(ROOTS_DASHBOARD, "/blog"),
    posts: path(ROOTS_DASHBOARD, "/blog/posts"),
    new: path(ROOTS_DASHBOARD, "/blog/new"),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(
      ROOTS_DASHBOARD,
      "/blog/post/apply-these-7-secret-techniques-to-improve-event"
    ),
  },
  genealogy: {
    root: path(ROOTS_DASHBOARD, "/genealogy"),
    matrix: path(ROOTS_DASHBOARD, "/genealogy/matrix"),
    binary: path(ROOTS_DASHBOARD, "/genealogy/binary"),
    monoLine: path(ROOTS_DASHBOARD, "/genealogy/mono-line"),
    sponsor: path(ROOTS_DASHBOARD, "/genealogy/sponsor"),
    tree: path(ROOTS_DASHBOARD, "/genealogy/tree"),
    list: path(ROOTS_DASHBOARD, "/genealogy/list"),
  },
  financial: {
    sales: path(ROOTS_DASHBOARD, "/financial/sales"),
    root: path(ROOTS_DASHBOARD, "/financial"),
    ewallet: path(ROOTS_DASHBOARD, "/financial/e-wallet"),
    deposit_wallet: path(ROOTS_DASHBOARD, "/financial/deposit-wallet"),
    fund_credits: path(ROOTS_DASHBOARD, "/financial/fund-credits"),
    payout: path(ROOTS_DASHBOARD, "/financial/payout"),
    pendingcommission: path(ROOTS_DASHBOARD, "/financial/pendingcommission"),
    financial_report: path(ROOTS_DASHBOARD, "/financial/report"),
    autofatture: path(ROOTS_DASHBOARD, "/financial/autofatture"),
  },
  communication: {
    root: path(ROOTS_DASHBOARD, "/communication"),
    blogCategories: path(ROOTS_DASHBOARD, "/communication/blog/categories"),
    draft_blog: path(ROOTS_DASHBOARD, "/communication/blog/posts/drafts"),
    help_center: path(ROOTS_DASHBOARD, "/communication/help-center"),
    addTicket: path(ROOTS_DASHBOARD, "/communication/help-center/tickets/add"),
    edit: (id) =>
      path(ROOTS_DASHBOARD, `/communication/help-center/tickets/edit/${id}`),
    help_center_tickets: path(
      ROOTS_DASHBOARD,
      "/communication/help-center/tickets"
    ),
    viewTickets: (id) =>
      path(ROOTS_DASHBOARD, `/communication/help-center/tickets/view/${id}`),
    newBlog: path(ROOTS_DASHBOARD, "/communication/blog/new"),
    editBlog: (bid) => path(ROOTS_DASHBOARD, `/communication/blog/${bid}`),
    viewBlog: (slug) =>
      path(ROOTS_DASHBOARD, `/communication/blog/posts/${slug}`),
    blog: path(ROOTS_DASHBOARD, "/communication/blog"),
    blog_draft: path(ROOTS_DASHBOARD, "/communication/blog/posts/draft"),
    com_faqs: path(ROOTS_DASHBOARD, "/communication/faqs"),
    mails: path(ROOTS_DASHBOARD, "/communication/mails"),
    com_support_department: path(
      ROOTS_DASHBOARD,
      "/communication/support/department"
    ),
    com_support_categories: path(
      ROOTS_DASHBOARD,
      "/communication/support/categories"
    ),
    com_support_priorities: path(
      ROOTS_DASHBOARD,
      "/communication/support/priorities"
    ),
    com_support_canned_response: path(
      ROOTS_DASHBOARD,
      "/communication/support/canned-response"
    ),
    com_support_tickets: path(
      ROOTS_DASHBOARD,
      "/communication/support/tickets"
    ),
    com_article_categories: path(
      ROOTS_DASHBOARD,
      "/communication/com_article_categories"
    ),
    com_article: path(ROOTS_DASHBOARD, "/communication/articles"),
    article_categories: path(
      ROOTS_DASHBOARD,
      "/communication/articles/categories"
    ),
  },
  tools: {
    root: path(ROOTS_DASHBOARD, "/tools"),
    documents: path(ROOTS_DASHBOARD, "/tools/documents"),
    videos: path(ROOTS_DASHBOARD, "/tools/videos"),
  },
  dashboard: {
    root: path(ROOTS_DASHBOARD, "/dashboard"),
    business: path(ROOTS_DASHBOARD, "/dashboard/business"),
    network: path(ROOTS_DASHBOARD, "/dashboard/network"),
  },
  members: {
    root: path(ROOTS_DASHBOARD, "/members"),
    network: path(ROOTS_DASHBOARD, "/members/network"),
    holdingTank: path(ROOTS_DASHBOARD, "/members/holding-tank"),
    member_profile: path(ROOTS_DASHBOARD, "/members/profile"),
    kyc_details: path(ROOTS_DASHBOARD, "/members/kyc-details"),
  },
  subscriptions: {
    root: path(ROOTS_DASHBOARD, "/subscriptions"),
    add_product: path(ROOTS_DASHBOARD, "/subscriptions/add_product"),
    add_business: path(ROOTS_DASHBOARD, "/subscriptions/add_business"),
  },
  subAdmin: {
    root: path(ROOTS_DASHBOARD, "/sub-admin"),
    sub_admins: path(ROOTS_DASHBOARD, "/sub-admin"),
    sub_admin_user: path(ROOTS_DASHBOARD, "/sub-admin/sub_admin_user"),
    add_sub_admin: path(ROOTS_DASHBOARD, "/sub-admin/add"),
    add_user_group: path(ROOTS_DASHBOARD, "/sub-admin/group/add"),
  },
  holdingTank: {
    root: path(ROOTS_DASHBOARD, "/holding-tank"),
  },
  pendingranks: {
    root: path(ROOTS_DASHBOARD, "/pendingranks"),
  },

  store: {
    root: path(ROOTS_DASHBOARD, "/store"),
    orderApproval: path(ROOTS_DASHBOARD, "/store/order-approval"),
    product_categories: path(ROOTS_DASHBOARD, "/store/products/categories"),
    products: path(ROOTS_DASHBOARD, "/store/products"),
    packages: path(ROOTS_DASHBOARD, "/store/packages"),
    subscriptions: path(ROOTS_DASHBOARD, "/store/subscriptions"),
    material_categories: path(ROOTS_DASHBOARD, "/store/materials/categories"),
    material: path(ROOTS_DASHBOARD, "/store/materials"),
    material_add: path(ROOTS_DASHBOARD, "/store/materials/add"),
    material_view: path(ROOTS_DASHBOARD, "/store/materials"),
    events: path(ROOTS_DASHBOARD, "/store/events"),
    events_add: path(ROOTS_DASHBOARD, "/store/events/add"),
    events_edit: path(ROOTS_DASHBOARD, "/store/events"),
    user_reviews: path(ROOTS_DASHBOARD, "/store/reviews"),
    user_reviews_add: path(ROOTS_DASHBOARD, "/store/reviews/add"),
    user_reviews_edit: path(ROOTS_DASHBOARD, "/store/reviews"),
    paymentMethods: path(ROOTS_DASHBOARD, "/store/payment-methods"),
    assign_subscriptions_cat: path(
      ROOTS_DASHBOARD,
      "/store/assign_subscriptions_cat"
    ),
    assign_subscriptions_add_product: path(
      ROOTS_DASHBOARD,
      "/store/assign-subscriptions/add_product"
    ),
    assign_subscriptions: path(ROOTS_DASHBOARD, "/store/assign-subscriptions"),
    business_builder_subscriptions: path(
      ROOTS_DASHBOARD,
      "/store/business_builder_subscriptions"
    ),
    sales: path(ROOTS_DASHBOARD, "/store/sales"),
    materials_management: path(ROOTS_DASHBOARD, "/store/materials_management"),
    business_builder: path(ROOTS_DASHBOARD, "/store/business_builder"),
    review_management: path(ROOTS_DASHBOARD, "/store/review_management"),
    user_subscriptions: path(ROOTS_DASHBOARD, "/store/user_subscriptions"),
    telegram_page: path(ROOTS_DASHBOARD, "/store/telegram_page"),
    coupons: path(ROOTS_DASHBOARD, "/store/coupons"),
    coupons_add: path(ROOTS_DASHBOARD, "/store/coupons/add"),
    coupons_edit: path(ROOTS_DASHBOARD, "/store/coupons"),
    product_access: path(ROOTS_DASHBOARD, "/store/product_access"),
    product_questions: path(ROOTS_DASHBOARD, "/store/product_questions"),
    product_edit: (id) =>
      path(ROOTS_DASHBOARD, buildPath("/store/products", id)),
    packages_edit: (id) =>
      path(ROOTS_DASHBOARD, buildPath("/store/packages", id)),
    subscription_edit: (id) =>
      path(ROOTS_DASHBOARD, buildPath("/store/subscriptions", id)),
    product_add: path(ROOTS_DASHBOARD, "/store/products/add"),
    packages_add: path(ROOTS_DASHBOARD, "/store/packages/add"),
    product_combo: path(ROOTS_DASHBOARD, "/store/products/combo"),
    sample_document: path(ROOTS_DASHBOARD, "/store/sample_document"),
    invoices: path(ROOTS_DASHBOARD, "/store/invoices"),
    invoices_edit: (id) =>
      path(ROOTS_DASHBOARD, buildPath("/store/invoices", id)),
  },
  settings: {
    root: path(ROOTS_DASHBOARD, "/settings"),
    network: {
      root: path(ROOTS_DASHBOARD, "/settings/network"),
      view: (slug) => path(ROOTS_DASHBOARD, `/settings/network/${slug}`),
    },
    email_settings: {
      root: buildPath(ROOTS_DASHBOARD, "settings/mail"),
      view: (id, params) =>
        squashPathAndQueryString(
          buildPath(ROOTS_DASHBOARD, "settings/mail", id),
          objectToQueryString(params)
        ),
    },
    brand: path(ROOTS_DASHBOARD, "/settings/brand"),
    business: path(ROOTS_DASHBOARD, "/settings/business"),
    withdrawal: path(ROOTS_DASHBOARD, "/settings/withdrawal"),
    currency: path(ROOTS_DASHBOARD, "/settings/currency"),
    advanced: path(ROOTS_DASHBOARD, "/settings/advanced-settings"),
    business_builder: path(ROOTS_DASHBOARD, "/settings/business_builder"),
    app_settings: path(ROOTS_DASHBOARD, "/settings/app_settings"),

    terms_conditions: path(ROOTS_DASHBOARD, "/settings/terms_conditions"),
    user_guidance: path(ROOTS_DASHBOARD, "/settings/user_guidance"),
    get_started: path(ROOTS_DASHBOARD, "/settings/get_started"),
  },
  leads: {
    root: path(ROOTS_DASHBOARD, "/leads"),
  },
  report: {
    root: path(ROOTS_DASHBOARD, "/report"),
    builder: path(ROOTS_DASHBOARD, "/report/builder"),

    // old
    fund_credit: path(ROOTS_DASHBOARD, "/report/fund/credit"),
    joining: path(ROOTS_DASHBOARD, "/report/joining"),
    member_income: path(ROOTS_DASHBOARD, "/report/income"),
    top_earners: path(ROOTS_DASHBOARD, "/report/earners"),
    payout_report: path(ROOTS_DASHBOARD, "/report/payout"),
    sales_report: path(ROOTS_DASHBOARD, "/report/sales"),
    builder_subscription: path(ROOTS_DASHBOARD, "/report/builder_subscription"),
    point_history: path(ROOTS_DASHBOARD, "/report/point/history"),
  },
};

export const PATH_USER = {
  mail: {
    root: path(ROOTS_USER, "/help-center/mails"),
    all: path(ROOTS_USER, "/help-center/mails/all"),
    replay: (id) => path(ROOTS_USER, `/help-center/mails/replay/${id}`),
  },
  user_dashboard: path(ROOTS_USER, "/dashboard"),
  affiliate_dashboard: path(ROOTS_USER, "/affiliate-dashboard"),
  root: path(ROOTS_USER, "/dashboard"),
  test: path(ROOTS_USER, "/test"),
  events: path(ROOTS_USER, "/events"),
  profile: { root: path(ROOTS_USER, "/profile") },
  telegram: path(ROOTS_USER, "/telegram"),
  subscriptions: {
    root: path(ROOTS_USER, "/subscriptions"),
    blog: (id) =>
      path(ROOTS_USER, `/subscriptions/blogs?type=subscriptions&id=${id}`),
    view:
      (id) =>
      (subPath = "") =>
        path(ROOTS_USER, `/subscriptions/view/${id}/${subPath}`),
  },

  recurring_orders: {
    root: path(ROOTS_USER, "/recurring-orders"),
    // view:
    //   (id) =>
    //   (subPath = "") =>
    //     path(ROOTS_USER, `/recurring_orders/view/${id}/${subPath}`),
  },

  coupons: {
    root: path(ROOTS_USER, "/coupons"),
    list: path(ROOTS_USER, "/coupons/list"),
    packages: path(ROOTS_USER, "/coupons/packages"),
    view: (id, params) =>
      squashPathAndQueryString(
        buildPath(ROOTS_USER, "coupons/packages", id),
        objectToQueryString(params)
      ),
  },
  onlineStore: {
    root: path(ROOTS_USER, "/online-store"),
    productSubscription: {
      root: path(ROOTS_USER, "/online-store/product-subscription"),
      checkout: path(ROOTS_USER, "/checkout"),
      shipping: path(ROOTS_USER, "/checkout/shipping"),
      packages: {
        root: path(ROOTS_USER, "/online-store/packages"),
        view: (name) => path(ROOTS_USER, `/online-store/packages/${name}`),
      },
      subscriptions: {
        root: path(ROOTS_USER, "/online-store/subscriptions"),
        view: (name) => path(ROOTS_USER, `/online-store/subscriptions/${name}`),
      },
      products: {
        root: path(ROOTS_USER, "/online-store/products"),
        view: (name) => path(ROOTS_USER, `/online-store/products/${name}`),
      },
      view: (name) =>
        path(ROOTS_USER, `/online-store/product-subscription/${name}`),
    },
  },
  my_orders: {
    root: path(ROOTS_USER, "/online-store/my-orders"),
    view: (id) => path(ROOTS_USER, `/online-store/my-orders/${id}`),
  },

  coupon_package: {
    root: path(ROOTS_USER, "/online-store/coupon-package"),
    view: (id) => path(ROOTS_USER, `/online-store/coupon-package/${id}`),
  },
  coupon_purchase: {
    root: path(ROOTS_USER, "/online-store/coupon-purchase-list"),
  },
  pending_approvals: {
    root: path(ROOTS_USER, "/online-store/pending-approvals"),
  },
  order_history: {
    root: path(ROOTS_USER, "/online-store/order-history"),
  },
  team_orders: {
    root: path(ROOTS_USER, "/online-store/team-orders"),
  },

  blogs: {
    root: path(ROOTS_USER, "/blogs"),
    category: (params = {}) =>
      squashPathAndQueryString(
        path(ROOTS_USER, "/blogs"),
        objectToQueryString(params)
      ),
    new: path(ROOTS_USER, "/blogs/new"),
    view: (param) => path(ROOTS_USER, `/blogs/${param}`),
  },
  business_builder: {
    root: path(ROOTS_USER, "/business-builder"),
    invoice: (id) => path(ROOTS_USER, `/business-builder/subscriptions/${id}`),
    subscriptions: path(ROOTS_USER, "/business-builder/subscriptions"),
    history: path(ROOTS_USER, "/business-builder/history"),
    materials: {
      root: path(ROOTS_USER, "/business-builder/materials"),
      view: (view = "blog") =>
        path(ROOTS_USER, `/business-builder/materials/${view}`),
    },
  },
  genealogy: {
    root: path(ROOTS_USER, "/genealogy"),
    binary: path(ROOTS_USER, "/genealogy/binary"),
    matrix: path(ROOTS_USER, "/genealogy/matrix"),
    monoLine: path(ROOTS_USER, "/genealogy/mono-line"),
    sponsor: path(ROOTS_USER, "/genealogy/sponsor"),
    affiliate: path(ROOTS_USER, "/genealogy/affiliate"),
    list: path(ROOTS_USER, "/genealogy/list"),
    tree: path(ROOTS_USER, "/genealogy/tree"),
    binaryLeg: path(ROOTS_USER, "/genealogy/binaryLeg"),
  },

  referals: {
    root: path(ROOTS_USER, "/referals"),
  },
  pendingcommissions: {
    root: path(ROOTS_USER, "/pendingcommissions"),
  },

  financial: {
    root: path(ROOTS_USER, "/financial"),
    eWallet: path(ROOTS_USER, "/financial/e-wallet"),
    depositWallet: path(ROOTS_USER, "/financial/deposit-wallet"),
    fundsTransfer: path(ROOTS_USER, "/financial/funds-transfer"),
    payout: path(ROOTS_USER, "/financial/payout"),
    pendingcommissions: path(ROOTS_USER, "/financial/pendingcommissions"),
    autofatture: path(ROOTS_USER, "/financial/autofatture"),
    coinAddress: path(ROOTS_USER, "/financial/coin-address"),
  },
  helpCenter: {
    root: path(ROOTS_USER, "/help-center"),
    tickets: path(ROOTS_USER, "/help-center/tickets"),
    documents: path(ROOTS_USER, "/help-center/documents"),
    videos: path(ROOTS_USER, "/help-center/videos"),
    faq: {
      root: path(ROOTS_USER, "/help-center/faqs"),
      view: (view = "view") => path(ROOTS_USER, `/help-center/faqs/${view}`),
    },
    knowledgeBase: {
      root: path(ROOTS_USER, `/help-center/knowledge-base`),
      question: (view) =>
        path(ROOTS_USER, `/help-center/knowledge-base/${view}`),
    },
    mails: {
      root: path(ROOTS_USER, "/help-center/mails"),
      inbox: path(ROOTS_USER, "/help-center/mails/inbox"),
    },
    view: (label) => path(ROOTS_USER, `/help-center/mails/${label}`),
    createTicket: {
      view: path(ROOTS_USER, "/help-center/create-ticket"),
      subCategory: (category = "all") =>
        path(ROOTS_USER, `/help-center/create-ticket/${category}`),
      contactSupport: path(
        ROOTS_USER,
        "/help-center/create-ticket/contact-support"
      ),
      otherSupport: path(
        ROOTS_USER,
        "/help-center/create-ticket/other-support"
      ),
    },

    mySupportTicket: path(
      ROOTS_USER,
      "/help-center/create-ticket/my-support-ticket"
    ),
  },
  incomeReport: {
    root: path(ROOTS_USER, "/income-report"),
  },
  leads: {
    root: path(ROOTS_USER, "/leads"),
  },

  missedPoints: {
    root: path(ROOTS_USER, "/missed-points"),
  },
};

export const USER_ROUTES = [
  "/dashboard",
  "/dashboard",
  "/events",
  "/profile",
  "/telegram",
  "/subscriptions",
  "/subscriptions/blogs?type=subscriptions&id=${id}",
  "/subscriptions/view/${id}/${subPath}",
  "/online-store",
  "/online-store/product-subscription",
  "/online-store/product-subscription/checkout",
  "/online-store/product-subscription/${name}",
  "/online-store/my-orders/${id}",
  "/online-store/checkout",
  "/online-store/my-orders",
  "/blogs",
  "/blogs/new",
  "/blogs/${param}",
  "/business-builder",
  "/business-builder/subscriptions",
  "/business-builder/history",
  "/business-builder/materials",
  "/business-builder/materials/${view}",
  "/genealogy",
  "/genealogy/binary",
  "/genealogy/sponsor",
  "/genealogy/affiliate",
  "/genealogy/binaryLeg",
  "referals",
  "pendingcommissions",
  "/financial",
  "/financial/e-wallet",
  "/financial/deposit-wallet",
  "/financial/funds-transfer",
  "/financial/payout",
  "/financial/coin-address",
  "/help-center",
  "/help-center/tickets",
  "/help-center/faqs",
  "/help-center/mails",
  "/help-center/mails/all",
  "/help-center/create-ticket",
  "/help-center/create-ticket/contact-support",
  "/help-center/create-ticket/other-support",
  "/help-center/create-ticket/my-support-ticket",
  "/help-center/faqs/${view}",
  "/help-center/knowledge-base",
  "/help-center/knowledge-base/${view}",
  "/help-center/mails/${label}",
  "/help-center/create-ticket/${category}",
  "/income-report",
  "/missed-points",
];

export const PATH_DOCS = "";
