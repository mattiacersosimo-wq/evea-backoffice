import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

import Page from "src/components/Page";
import { PATH_DASHBOARD } from "src/routes/paths";
import FormFund from "./components/form-fund";
import useFilter from "src/pages/admin/financial/fundCredit/components/data-table/hooks/use-filter.js";
import useHistory from "./components/data-table/hooks/use-history";

const FundCredits = () => {
  const methods = useFilter();
  const filter = methods.watch();
  const { state, fetchData, rowStart, ...rest } = useHistory(filter);

  return (
    <Page title="financial.fund_credit.title">
      <Box>
        <HeaderBreadcrumbs
          heading="financial.fund_credit.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "financial.fund_credit.title" },
          ]}
        />

        <FormFund
          method={methods}
          state={state}
          fetchData={fetchData}
          rowStart={rowStart}
          {...rest}
        />
      </Box>
    </Page>
  );
};

export default FundCredits;
