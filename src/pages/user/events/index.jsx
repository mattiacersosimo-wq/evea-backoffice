import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { PATH_USER } from "src/routes/paths";

import Events from "src/pages/user/subscriptions/events/index";

const AllEvents = () => {
  return (
    <Page title={"userEvents.events"}>
      <HeaderBreadcrumbs
        heading={"eventDetails"}
        links={[
          { name: "dashboard", href: PATH_USER.user_dashboard },
          { name: "userEvents.events" },
        ]}
      />
      <Events />
    </Page>
  );
};

export default AllEvents;
