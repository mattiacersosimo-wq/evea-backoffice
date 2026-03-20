import { Alert, Box, Card, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";

import moment from "moment";
import { useMemo } from "react";
import Ternary from "src/components/ternary";
import { PATH_DASHBOARD } from "src/routes/paths";
import useFetchSummary from "../hooks/useFetchSummary";
import useFetchWitPagination from "../hooks/useFetchWithPagination";
import Cards from "./cards";
import DataList from "./dataList";
import RequestForm from "./requestForm";

const Index = () => {
  const _data = [
    {
      title: "financial.payout.cards.balance",
      key: "available_balance",

      color: "#795548",
      icon: "entypo:wallet",
    },
    {
      title: "financial.payout.cards.min",
      key: "minimum_withdrawal",
      color: "#ccc",
      icon: "entypo:wallet",
    },
  ];

  const { state, rowStart, fetchData, ...rest } =
    useFetchWitPagination("payout-request");

  const { summary, fetchData: fetchSummary } = useFetchSummary(
    "request-payout-data"
  );

  const availableToday = useMemo(() => {
    if (summary?.withdrawal_open_days?.length > 0) {
      const test = summary?.withdrawal_open_days || [];
      const day = moment().format("dddd");
      return test.includes(day);
    } else if (summary?.withdrawal_open_days?.length === 0) {
      return false;
    }
    return true;
  }, [summary?.withdrawal_open_days]);

  return (
    <>
      <div>
        <Page title="financial.payout.title">
          <Box>
            <HeaderBreadcrumbs
              heading="financial.payout.title"
              links={[
                { name: "global.dashboard", href: PATH_DASHBOARD.root },
                {
                  name: "financial.payout.title",
                },
              ]}
            />
            <Box sx={{ mb: 2 }}>
              {summary?.description ? (
                <Alert severity="success">{summary?.description}</Alert>
              ) : null}
            </Box>

            <Box sx={{ mb: 2 }}>
              {!availableToday ? (
                <Alert severity="error">
                  <Ternary
                    when={summary?.withdrawal_open_days?.length === 0}
                    then="Payout is not available today"
                    otherwise={
                      <Ternary
                        when={summary?.withdrawal_open_days?.length > 0}
                        then={`Payout available on ${summary?.withdrawal_open_days}`}
                      />
                    }
                  />
                </Alert>
              ) : null}
            </Box>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={3}>
                {_data.map((props) => (
                  <Grid item xs={12} md={4}>
                    <Cards {...props} total={summary[props.key]} />
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12} md={12}>
                <RequestForm
                  availableToday={availableToday}
                  fetchData={() => {
                    fetchData();
                    fetchSummary();
                  }}
                  minimumWithdrawal={summary.minimum_withdrawal}
                />
              </Grid>
            </Card>
            <Grid item xs={12} md={12}>
              <DataList state={state} rowStart={rowStart} />
            </Grid>
          </Box>
        </Page>
      </div>

      <PaginationButtons {...rest} />
    </>
  );
};

export default Index;
