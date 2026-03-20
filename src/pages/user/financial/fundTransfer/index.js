import { Box, Card, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";

import { PATH_DASHBOARD } from "src/routes/paths";
import useFetchSummary from "../hooks/useFetchSummary";
import Cards from "./cards";
import DataList from "./dataList";
import useFundTransfer from "./hooks/useFundTransfer";
import SendForm from "./sendForm";

const Index = () => {
  const _data = [
    {
      title: "financial.fund_transfer.cards.e_balance",
      color: "#795548",
      icon: "entypo:wallet",
      key: "ewallet_balance",
    },
    {
      title: "financial.fund_transfer.cards.d_balance",
      color: "#607d8b",
      icon: "fluent:wallet-32-filled",
      key: "deposit_wallet_balance",
    },
  ];

  const { summary, fetchData: fetchSummary } = useFetchSummary(
    "fund-transfer-data",
    {}
  );
  const { refetch, state, rowStart, ...rest } = useFundTransfer();

  return (
    <div>
      <Page title="financial.fund_transfer.title">
        <Box>
          <HeaderBreadcrumbs
            heading="financial.fund_transfer.title"
            links={[
              { name: "global.dashboard", href: PATH_DASHBOARD.root },
              { name: "financial.fund_transfer.title" },
            ]}
          />
          <Card sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {_data.map((props) => (
                <Grid item xs={12} md={4}>
                  <Cards {...props} total={summary[props.key]} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} md={12}>
              <SendForm
                isFundTransfer
                refetch={() => {
                  refetch();
                  fetchSummary();
                }}
              />
            </Grid>
          </Card>
          <Grid item xs={12} md={12}>
            <DataList state={state} rowStart={rowStart} />
          </Grid>
          <PaginationButtons {...rest} />
        </Box>
      </Page>
    </div>
  );
};

export default Index;
