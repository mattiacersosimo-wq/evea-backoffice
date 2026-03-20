import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "src/routes/Loadable";

const Mail = Loadable(
  lazy(() => import("src/pages/admin/communications/Mail/admin/index"))
);
const MailList = Loadable(
  lazy(() => import("src/pages/admin/communications/Mail/admin/mailList"))
);

const MailDetails = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/Mail/subPages/MailDetails/index")
  )
);

const Compose = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/Mail/components/compose/index")
  )
);

const mails = {
  path: "mails",
  element: <Mail />,
  children: [
    { index: true, element: <Navigate to="inbox" /> },
    { path: "compose", element: <Compose /> },
    { path: "replay/:id", element: <Compose /> },
    {
      path: ":systemLabel",
      children: [
        {
          index: true,
          element: <MailList />,
        },
        {
          path: ":mailId",
          element: <MailDetails />,
        },
      ],
    },
  ],
};

export default mails;
