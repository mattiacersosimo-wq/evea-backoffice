import { lazy } from "react";
import Loadable from "../Loadable";

const SubscriptionTabs = Loadable(
  lazy(() => import("src/pages/user/subscriptions/subscriptionTabs"))
);

const Subscriptions = Loadable(
  lazy(() => import(`src/pages/user/subscriptions/index`))
);
const Home = Loadable(
  lazy(() => import("src/pages/user/subscriptions/home/index"))
);

const Document = Loadable(
  lazy(() => import("src/pages/user/subscriptions/documents/index"))
);

const Events = Loadable(
  lazy(() => import("src/pages/user/subscriptions/events/index"))
);

const Videos = Loadable(
  lazy(() => import("src/pages/user/subscriptions/videos/index"))
);
const Comment = Loadable(
  lazy(() => import("src/pages/user/subscriptions/review/index"))
);

const BlogPosts = Loadable(
  lazy(() => import("src/pages/user/blogs/BlogPosts"))
);

const subscriptions = {
  path: "subscriptions",
  children: [
    { index: true, element: <Subscriptions /> },
    { path: "blogs", element: <BlogPosts /> },
    {
      path: "view/:id",
      element: <SubscriptionTabs />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "documents", element: <Document /> },
        { path: "events", element: <Events /> },
        { path: "videos", element: <Videos /> },
        { path: "comment", element: <Comment /> },
      ],
    },
  ],
};

export default subscriptions;
