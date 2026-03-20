import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import Form from "../Form";
import useAddEvent from "./hooks/useAddEvent";

const EventAdd = () => {
  const { methods, onSubmit } = useAddEvent();

  return (
    <div>
      <Page title={"events.events"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"events.events"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "events.events",
                href: PATH_DASHBOARD.store.events,
              },
              { name: "events.add" },
            ]}
          />
          <Form methods={methods} onSubmit={onSubmit} />
        </Box>
      </Page>
    </div>
  );
};

export default EventAdd;
