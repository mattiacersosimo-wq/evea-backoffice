import { lazy } from "react";
import { Navigate } from "react-router";
// import TicketView from "src/pages/admin/communications/tickets/viewTickets";
import TicketView from "src/pages/admin/communications/tickets/viewTickets";

import Loadable from "../../../Loadable";

const HelpCenterTicket = Loadable(
  lazy(() => import("src/pages/admin/communications/help-center/ticket/index"))
);
const TicketDashboard = Loadable(
  lazy(() =>
    import(
      "src/pages/admin/communications/help-center/ticket/ticketDashboard/index"
    )
  )
);

const TicketDepartment = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/help-center/ticket/department/index")
  )
);
const TicketCategories = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/help-center/ticket/categories/index")
  )
);
const TicketCannedResponses = Loadable(
  lazy(() =>
    import(
      "src/pages/admin/communications/help-center/ticket/cannedResponse/index"
    )
  )
);
const TicketPriorities = Loadable(
  lazy(() =>
    import("src/pages/admin/communications/help-center/ticket/prioritys/index")
  )
);
const EditTicketView = Loadable(
  lazy(() => import("src/pages/admin/communications/tickets/form/edit/index"))
);

const AddTicket = Loadable(
  lazy(() => import("src/pages/admin/communications/tickets/form/add/index"))
);

const helpCenter = {
  path: "help-center",
  children: [
    {
      index: true,
      element: <Navigate to="tickets" />,
    },
    {
      path: "tickets",
      element: <HelpCenterTicket />,
      children: [
        { index: true, element: <Navigate to="open" /> },
        {
          path: "department",
          element: <TicketDepartment />,
        },
        {
          path: "categories",
          element: <TicketCategories />,
        },
        {
          path: "canned-responses",
          element: <TicketCannedResponses />,
        },
        {
          path: "priorities",
          element: <TicketPriorities />,
        },
        { path: ":type", element: <TicketDashboard /> },
        { path: "edit/:id", element: <EditTicketView /> },
        { path: "add", element: <AddTicket /> },
        { path: "view/:id", element: <TicketView /> },
      ],
    },
  ],
};

export default helpCenter;
