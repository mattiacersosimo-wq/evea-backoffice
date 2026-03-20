import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";

const Wrapper = ({ children }) => {
  return (
    <div>
      <Page title={"assign_subscriptions.assignSubscriptionsTitle"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"assign_subscriptions.assign_subscriptions"}
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              {
                name: "assign_subscriptions.assign_subscriptions",
              },
            ]}
          />

          {children}
        </Box>
      </Page>
    </div>
  );
};

export default Wrapper;
