import { lazy } from "react";
import { HideLeads } from "src/guards/AuthGuard";
import Loadable from "src/routes/Loadable";

const Lead = Loadable(lazy(() => import("src/pages/admin/leads/list/index")));

const lead = [
  {
    path: "leads",
    children: [
      {
        index: true,
        element: (
          <HideLeads>
            <Lead />
          </HideLeads>
        ),
      },
    ],
  },
];

export default lead;
