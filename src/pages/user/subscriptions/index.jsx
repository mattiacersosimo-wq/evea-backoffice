import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import { PATH_USER } from "src/routes/paths";
import MySubscription from "./components/card";
import useFetchSubscription from "./components/content/hooks/useFetchSubscription";
import Search from "./components/search";
import StatusToggle from "./components/status-toggle";
import SubscriptionProvider from "./store/subscription";

const Subscriptions = () => {
  const { state, rowStart, fetchData, ...rest } = useFetchSubscription();
  const { data, ...dataProps } = state;

  return (
    <Page title={"user.subscriptions.title"}>
      <Box sx={{ p: 2 }}>
        <HeaderBreadcrumbs
          heading={"user.subscriptions.title"}
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "user.subscriptions.title" },
          ]}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Search fetchData={fetchData} />

        <StatusToggle reload={fetchData} />
      </Box>
      <DataHandlerList dataProps={dataProps}>
        <Map
          list={data}
          render={(product) => (
            <SubscriptionProvider data={product}>
              <MySubscription fetchData={fetchData} key={product?.id} />
            </SubscriptionProvider>
          )}
        />
      </DataHandlerList>

      <PaginationButtons {...rest} />
    </Page>
  );
};

export default Subscriptions;
