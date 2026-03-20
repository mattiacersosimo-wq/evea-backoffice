import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import Form from "../Form";
import useEditEvent from "./hooks/use-edit-event";

const EventEdit = () => {
  const { methods, onSubmit } = useEditEvent();

  return (
    <div>
      <Page title={"events.edit"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"events.edit"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "events.events",
                href: PATH_DASHBOARD.store.events,
              },
              { name: "events.edit" },
            ]}
          />

          <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)} />
        </Box>
      </Page>
    </div>
  );
};

export default EventEdit;
