import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useTranslation } from "react-i18next";
import TotalWidget from "../widgets/TotalWidget";
import useTotal from "./useTotal";

const Total = () => {
  const { payout_mom, total_network_bonus, total_payout, network_bonus_mom } =
    useTotal();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TotalWidget
          title={t("network.total_network_bonus")}
          // percent={network_bonus_mom}
          total={parseFloat(total_network_bonus)}
          src="/icons/dashboard/bonus.png"
          bgColor={theme.palette.widgets.purple[500]}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TotalWidget
          title={t("network.total_payout")}
          // percent={payout_mom}
          total={parseFloat(total_payout)}
          src="/icons/dashboard/payout.png"
          bgColor={theme.palette.widgets.blue[200]}
        />
      </Grid>
    </>
  );
};

export default Total;
