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
import { DataList, FilterCard } from "./components";
import Summary from "./components/summary";

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

  const { state, fetchData, ...rest } = useFetchWitPagination(
    "ewallet",
    filter
  );
  const { summary, fetchData: fetchSummary } = useFetchSummary(
    "ewallet-data",
    filter
  );

  return (
    <div>
      <Page title="financial.e_wallet.title">
        <Box>
          <HeaderBreadcrumbs
            heading="financial.e_wallet.title"
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              { name: "financial.e_wallet.title" },
            ]}
          />

          <Grid container spacing={3}>
            <Summary summary={summary} />
            <Grid item xs={12} md={12}>
              <FilterCard
                methods={methods}
                fetchData={async (filter) => {
                  await fetchData(1, filter);
                  await fetchSummary(filter);
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DataList state={state} {...rest} />
            </Grid>
          </Grid>
        </Box>
      </Page>
    </div>
  );
};

export default Index;
