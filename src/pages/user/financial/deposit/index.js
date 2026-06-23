import { Box, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import { PATH_USER } from "src/routes/paths";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";
import useFetchSummary from "../hooks/useFetchSummary";
import useFetchWitPagination from "../hooks/useFetchWithPagination";
import Cards from "./cards";
import DataList from "./components/dataTable";
import FilterCard from "./components/filter/index";
import PayNow from "./payNow";

const _data = [
  {
    title: "financial.deposit_wallet.cards.balance",
    icon: "arcticons:priceconverter",
    color: "#d279a6",
    key: "balance",
  },
  {
    title: "financial.deposit_wallet.cards.transfer",
    icon: "bx:transfer-alt",
    color: "#6699ff",
    key: "transfer_out",
  },
  {
    title: "financial.deposit_wallet.cards.credited_by_admin",
    icon: "material-symbols:admin-panel-settings",
    color: "#26a69a",
    key: "credited_by_admin",
  },
];

const defaultValues = {
  start_date: null,
  end_date: null,
  from_id: null,
  payment_type: "all",
};

const schema = object().shape({
  start_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_start.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.end_date === null) return true;
      return (
        moment(ctx.parent.end_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) >= 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  end_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_end.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.start_date === null) return true;
      return (
        moment(ctx.parent.start_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) <= 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});

const Index = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const filter = methods.watch();
  const { state, data, fetchData, ...rest } = useFetchWitPagination(
    "deposit-wallet",
    filter
  );
  const { summary, fetchData: fetchSummary } = useFetchSummary(
    "deposit-wallet-data"
  );

  return (
    <div>
      <Page title="financial.deposit_wallet.title">
        <Box>
          <HeaderBreadcrumbs
            heading="financial.deposit_wallet.title"
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              { name: "financial.deposit_wallet.title" },
            ]}
          />

          <Grid container spacing={3}>
            {_data.map((props) => (
              <Grid item xs={12} md={4}>
                <Cards {...props} total={summary[props.key]} />
              </Grid>
            ))}
            {/* <Grid item xs={12} md={12}>
              <PayNow balance={summary.balance} />
            </Grid> */}

            <Grid item xs={12} md={12}>
              <FilterCard
                methods={methods}
                fetchData={async (filter) => {
                  await fetchData(1, filter);
                  await fetchSummary(filter);
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <DataList state={state} {...rest} />
          </Grid>
        </Box>
      </Page>
    </div>
  );
};

export default Index;
