import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "../Loadable";

const Faq = Loadable(lazy(() => import("src/pages/user/helpCenter/faq/index")));

const KnowledgeBase = Loadable(
  lazy(() => import("src/pages/user/helpCenter/knowledgeBase/index"))
);
const Questions = Loadable(
  lazy(() => import("src/pages/user/helpCenter/knowledgeBase/question/index"))
);

const ContactSupport = Loadable(
  lazy(() => import("src/pages/user/helpCenter/ticket/contact/index"))
);

const Tickets = Loadable(
  lazy(() => import("src/pages/user/helpCenter/materialTickets/index"))
);

const TicketView = Loadable(
  lazy(() => import("src/pages/user/helpCenter/ticket/viewTickets"))
);

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
const Documents = Loadable(
  lazy(() => import("src/pages/user/helpCenter/DowloadDoc/Index.js"))
);
const Videos = Loadable(
  lazy(() => import("src/pages/user/helpCenter/video/index.js"))
);

const helpCenter = {
  path: "help-center",
  children: [
    { index: true, element: <Navigate to="faqs" /> },
    {
      path: "faqs",
      children: [
        { index: true, element: <Navigate to="view" /> },
        {
          path: ":label",
          element: <Faq />,
        },
      ],
    },
    {
      path: "knowledge-base",
      children: [
        {
          index: true,
          element: <KnowledgeBase />,
        },
        {
          path: ":slug",
          element: <Questions />,
        },
      ],
    },
    {
      path: "mails",
      element: <Mail />,
      children: [
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
    },

    {
      path: "create-ticket",
      children: [
        {
          index: true,
          element: <Navigate to="open" />,
        },

        {
          path: ":label",
          children: [
            { index: true, element: <Tickets /> },
            { path: ":id", element: <TicketView /> },
          ],
        },

        {
          path: "contact-support",
          element: <ContactSupport />,
        },
      ],
    },
    { path: "documents", element: <Documents /> },
    { path: "videos", element: <Videos /> },
  ],
};

export default helpCenter;
