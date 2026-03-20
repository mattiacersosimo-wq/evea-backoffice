import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";
import buildPath from "src/utils/build-path";
import communication from "./communication";
import dashboard from "./dashboard";
import financial from "./financial";
import genealogy from "./genealogy";
import lead from "./lead";
import members from "./members";
import reports from "./reports";
import settings from "./settings";
import statistics from "./statistics";
import store from "./store";
import subAdmin from "./subAdmin";
import subscriptions from "./subscriptions";
import tools from "./tools";
import pendingranks from "./pendingranks";
import user from "./user";

const InvoiceList = Loadable(
  lazy(() => import("src/pages/admin/invoices/list/index.jsx"))
);
const InvoiceDetails = Loadable(
  lazy(() => import("src/pages/admin/invoices/details/index"))
);

const test = {
  communication: communication,
  dashboard: dashboard,
  financial: financial,
  genealogy: genealogy,
  members: members,
  reports: reports,
  settings: settings,
  statistics: statistics,
  store: store,
  subAdmin: subAdmin,
  subscriptions: subscriptions,
  tools: tools,
  pendingranks: pendingranks,
  user: user,
  lead: lead,
};

const availableRoutes = [
  ...communication,
  ...dashboard,
  ...financial,
  ...genealogy,
  ...members,
  ...reports,
  ...settings,
  ...statistics,
  ...store,
  ...subAdmin,
  ...subscriptions,
  ...tools,
  ...pendingranks,
  ...user,
  ...lead,

  {
    path: "invoices",
    children: [
      { index: true, element: <InvoiceList /> },
      {
        path: ":id",
        element: <InvoiceDetails />,
      },
    ],
  },
];

const genRoutes = (isSubAdmin = false) => {
  if (isSubAdmin) {
    const menu = JSON.parse(localStorage.getItem("menu") || "[]");
    let routesList = [...user, ...subscriptions, ...statistics, ...lead];
    menu.forEach(({ items }) =>
      items.forEach(({ title }) => {
        const actualTitle = title.split(".")[1];
        let menuObj = {
          path: "",
          children: [],
        };

        const subMenu = test[actualTitle]?.find(Boolean);
        if (subMenu?.element) {
          menuObj = { ...menuObj, element: subMenu?.element };
        }
        if (subMenu !== undefined) {
          items.forEach(({ children }) => {
            children.forEach(({ path }) => {
              subMenu.children?.forEach(
                ({ path: subMenuPath, children, element }) => {
                  const generatedPath = buildPath(
                    "/admin",
                    subMenu?.path,
                    subMenuPath
                  );
                  if (generatedPath === path || generatedPath.includes(":")) {
                    if (children?.length > 0) {
                      if (element) {
                        menuObj = {
                          ...menuObj,
                          path: subMenu.path,
                          children: [
                            ...menuObj.children,
                            { path: subMenuPath, element, children },
                          ],
                        };
                      } else {
                        menuObj = {
                          ...menuObj,
                          path: subMenu.path,
                          children: [
                            ...menuObj.children,
                            { path: subMenuPath, children },
                          ],
                        };
                      }
                    } else {
                      menuObj = {
                        ...menuObj,
                        path: subMenu.path,
                        children: [
                          ...menuObj.children,
                          { path: subMenuPath, element },
                        ],
                      };
                    }
                  }
                }
              );
            });
          });
          menuObj = {
            ...menuObj,
            children: [
              {
                element: <Navigate to={menuObj.children.find(Boolean)?.path} />,
                index: true,
              },

              ...menuObj.children,
            ],
          };

          if (test[actualTitle]) routesList.push(menuObj);
        }
      })
    );

    return routesList.flat();
  }
  return availableRoutes;
};

export default genRoutes;
