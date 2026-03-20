import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";

import { PATH_DASHBOARD } from "src/routes/paths";
import useSubscriptionSales from "./hooks/useSubscription";
import ReportCard from "./reportCard";
import SubscriptionSales from "./subscriptionSales";

const Index = () => {
  const { state, topSectionData, tableData, fetchData, rowStart, ...rest } =
    useSubscriptionSales();

  return (
    <div>
      <Page title={"businessBuilder.businessBuilderTitle"}>
        <Box sx={{ p: 2 }}>
          <HeaderBreadcrumbs
            heading={"businessBuilder.business_builder_subscriptions_sales"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "businessBuilder.business_builder_subscriptions_sales",
              },
            ]}
          />
          <ReportCard data={topSectionData} />
          <Card sx={{ p: 3, mt: 3 }}>
            <SubscriptionSales
              tableData={state}
              fetchData={fetchData}
              rowStart={rowStart}
            />
          </Card>
          <PaginationButtons {...rest} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
