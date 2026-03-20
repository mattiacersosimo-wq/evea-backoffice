import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";
import blog from "./blog";
import helpCenter from "./helpCenter";
import mails from "./main";

const Articles = Loadable(
  lazy(() => import("src/pages/admin/communications/articles/articles/index"))
);
const ArticleCategories = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/articles/article-categories/index")
  )
);

const ArticleCommunication = Loadable(
  lazy(() => import("src/pages/admin/communications/articles/index"))
);

const Faq = Loadable(
  lazy(() => import("src/pages/admin/communications/faq/index"))
);
const FaqCategory = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/faq/category-management/index")
  )
);

const FaqManagement = Loadable(
  lazy(() => import("src/pages/admin/communications/faq/faq-management/index"))
);

const communication = [
  {
    path: "communication",
    children: [
      { element: <Navigate to="blog" />, index: true },
      { ...blog },
      { ...mails },
      { ...helpCenter },
      {
        path: "faqs",
        element: <Faq />,
        children: [
          { index: true, element: <FaqManagement /> },
          { path: "category", element: <FaqCategory /> },
        ],
      },

      {
        path: "articles",
        element: <ArticleCommunication />,
        children: [
          {
            index: true,
            element: <Articles />,
          },
          {
            path: "categories",
            element: <ArticleCategories />,
          },
        ],
      },
    ],
  },
];

export default communication;
