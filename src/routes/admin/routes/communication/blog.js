import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const BlogCategories = Loadable(
  lazy(() => import("src/pages/admin/communications/blogs/blogCategory/index"))
);

const BlogAdd = Loadable(
  lazy(() => import("src/pages/admin/communications/blogs/NewBlog"))
);

const Blogs = Loadable(
  lazy(() => import("src/pages/admin/communications/blogs/index"))
);

const BlogList = Loadable(
  lazy(() => import("src/pages/admin/communications/blogs/blogList"))
);

const EditBlog = Loadable(
  lazy(() => import("src/pages/admin/communications/blogs/EditBlog"))
);

const blog = {
  path: "blog",
  children: [
    { index: true, element: <Navigate to="posts/published" /> },
    {
      path: "posts",
      element: <Blogs />,
      children: [
        { path: "published", element: <BlogList /> },
        { path: "drafts", element: <BlogList isDraft /> },
      ],
    },

    { path: "categories", element: <BlogCategories /> },
    { path: "new", element: <BlogAdd /> },
    { path: ":bid", element: <EditBlog /> },
  ],
};

export default blog;
