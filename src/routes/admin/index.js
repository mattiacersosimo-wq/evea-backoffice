import { Navigate } from "react-router-dom";
import { PATH_AFTER_LOGIN } from "src/config";
import AuthGuard, { AdminGuard } from "src/guards/AuthGuard";
import Layout from "src/layouts/layout";
import genRoutes from "./routes";

const genAdmin = (isSubAdmin = false) => {
  return [
    {
      path: "admin",
      element: (
        <AuthGuard>
          <AdminGuard>
            <Layout />
          </AdminGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        ...genRoutes(isSubAdmin),
      ],
    },
  ];
};

export default genAdmin;
