import { PATH_DASHBOARD } from "./routes/paths";

export const DATE_FORMAT = "DD MMM YYYY";

export const AUTH_INFO = {
    user: {
        email: process.env.REACT_APP_USER_USERNAME || "",
        password: process.env.REACT_APP_USER_PASSWORD || "",
    },
    admin: {
        email: process.env.REACT_APP_ADMIN_USERNAME || "",
        password: process.env.REACT_APP_ADMIN_PASSWORD || "",
    },
};
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const IS_DEV_MODE = process.env.REACT_APP_DEV_MODE === "TRUE";
export const PLAN_NAME = process.env.REACT_APP_PLAN_NAME;
export const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || "Cloud-MLM";
export const ADOBE_ID = process.env.REACT_APP_ADOBE_ID;
export const STRIPE_PK = process.env.REACT_APP_STRIPE_PK || "";
export const DEFAULT_FALLBACK_IMAGE = "https://placehold.co/600x400";
const rawHostApi = process.env.REACT_APP_HOST_NAME || "";

export const HOST_API = rawHostApi.replace(/\/+$/, "");
export const buildApiUrl = (path = "") => {
    const normalizedPath = String(path).replace(/^\/+/, "");

    if (!normalizedPath) {
        return HOST_API;
    }

    if (!HOST_API) {
        return `/${normalizedPath}`;
    }

    return `${HOST_API}/${normalizedPath}`;
};
export const USE_LOGIN = process.env.REACT_APP_LOGIN_HELPER === "TRUE";
export const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME || "";
export const CURRENCY = process.env.REACT_APP_CURRENCY || "USD";
export const ENABLE_VISITOR_MODE =
    process.env.REACT_APP_ENABLE_VISITOR_MODE === "TRUE";
export const REACT_APP_ENABLE_VISITOR_HOST =
    process.env.REACT_APP_ENABLE_VISITOR_HOST;
export const TAWK_PROPERTY_ID = process.env.REACT_APP_TAWK_PROPERTY_ID || "";
export const TAWK_ID = process.env.REACT_APP_TAWK_ID || "";

export const FIREBASE_API = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const WP_URL =
    process.env.REACT_APP_WP_URL || window.location.origin;


export const WEBSITE_URL =
    process.env.REACT_APP_WEBSITE_URL || window.location.origin;

export const MAPBOX_API = process.env.REACT_APP_MAPBOX;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
    MOBILE_HEIGHT: 64,
    MAIN_DESKTOP_HEIGHT: 88,
    DASHBOARD_DESKTOP_HEIGHT: 92,
    DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
    BASE_WIDTH: 260,
    DASHBOARD_WIDTH: 280,
    DASHBOARD_COLLAPSE_WIDTH: 88,
    //
    DASHBOARD_ITEM_ROOT_HEIGHT: 48,
    DASHBOARD_ITEM_SUB_HEIGHT: 40,
    DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
    NAVBAR_ITEM: 22,
    NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// Please remove `localStorage` when you set settings.
// ----------------------------------------------------------------------

export const defaultSettings = {
    themeMode: "light",
    themeDirection: "ltr",
    themeColorPresets: "default",
    themeLayout: "horizontal",
    themeStretch: false,
};
