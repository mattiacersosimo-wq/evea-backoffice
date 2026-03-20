import { Card, Typography } from "@mui/material";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import { PAYOUT_TYPE_IDS } from "src/utils/types";
import Coins from "./components/coins";

const Available = () => {
  const symbol = useGetCurrencySymbol();
  const { watch } = useFormContext();
  const payment_types = watch("payment_type");

  const showCoin = useMemo(() => {
    if (payment_types.length > 0) {
      return (
        payment_types.findIndex((item) => item === PAYOUT_TYPE_IDS.crypto) > -1
      );
    }

    return false;
  }, [payment_types.length]);

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <Translate>{"settings.network.min_amount"}</Translate> {symbol}
      </Typography>
      <RHFTextField fullWidth size="small" name="min_amount" />

      <Ternary
        when={showCoin}
        then={
          <>
            <Typography
              variant="subtitle2"
              sx={{ mt: 1, mb: 1, fontSize: "0.8rem" }}
            >
              <Translate>{"settings.network.available_coins"}</Translate>
            </Typography>
            <Coins />
          </>
        }
      />
    </Card>
  );
};

export default Available;
