import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Page from "src/components/Page";
import {
  BalanceWidget,
  LatestSales,
  NetworkBalanceWidget,
  ProfitWidget,
  SalesGraph,
  SalesOverview,
  TopSellingProducts,
} from "../components";

import { useTranslation } from "react-i18next";
import Sales from "src/images/admindasboard/Sales.png";
import NetworkBonus from "src/images/admindasboard/bonus.png";
import Expense from "src/images/admindasboard/expense.png";
import Payout from "src/images/admindasboard/payout.png";
import Profit from "src/images/admindasboard/profit.png";
import BalanceIcon from "src/images/balance.png";
import useWidgetData from "./hooks/useWidgetData";

const Business = () => {
  const {
    balance,
    total_network_bonus,
    profit_mom,
    total_profit,
    total_sales,
    total_sales_mom,
    total_expense,
    network_bonus_mom,
    expense_mom,
    total_balance,
    total_balance_mom,
  } = useWidgetData();

  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Page title={"global.dashboard"}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <BalanceWidget title={t("business.latest_registrations")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfitWidget
                bgColor={theme.palette.widgets.blue[500]}
                icon={Sales}
                title={t("business.total_sales")}
                prev={total_sales_mom || 0}
                current={total_sales || 0}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ProfitWidget
                bgColor={theme.palette.widgets.yellow[500]}
                icon={Expense}
                title={t("business.total_expense")}
                prev={expense_mom || 0}
                current={total_expense || 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfitWidget
                bgColor={theme.palette.widgets.green[200]}
                title={t("business.total_profit")}
                prev={profit_mom || 0}
                current={total_profit || 0}
                icon={Profit}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} mt={2}>
              <NetworkBalanceWidget
                bgColor={theme.palette.widgets.purple[500]}
                title={t("business.network_bonus")}
                total={parseFloat(total_network_bonus)}
                prev={network_bonus_mom}
                icon={NetworkBonus}
              />
            </Grid>

            <Grid item xs={12} md={6} mt={2}>
              <NetworkBalanceWidget
                bgColor={theme.palette.widgets.blue[100]}
                title={t("business.balance")}
                total={total_balance || 0}
                prev={total_balance_mom}
                icon={Payout}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <SalesOverview />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
          <SalesGraph />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} mt={2}>
          <LatestSales />
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
          <TopSellingProducts />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Business;
