import { Box, Button, Card, Collapse, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import useErrors from "src/hooks/useErrors";

import { useTranslation } from "react-i18next";
import {
  getSelectedSymbol,
  useGetCurrencySymbol,
} from "src/components/with-prefix";
import fetchUser from "src/utils/fetchUser";
import Coin from "./Coin";
import usePayNow from "./hooks/usePayNow";

const useBusinessBuilders = () => {
  const [businessBuilders, setBusinessBuilders] = useState([]);
  const handleErrors = useErrors();
  const fetchData = async () => {
    try {
      const { status, data } = await (
        await fetchUser("business-builder-list")
      ).data;

      if (status) {
        setBusinessBuilders(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return businessBuilders;
};

const PayNow = () => {
  const { methods, onSubmit } = usePayNow();

  const { amount, period_month, business_builder_id, coin_id } =
    methods.watch();
  const openCoin = Boolean(amount && period_month && business_builder_id);

  const businessBuilders = useBusinessBuilders();

  const { t } = useTranslation();
  const symbol = useGetCurrencySymbol();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          display: "grid",
          rowGap: 3,
          columnGap: 2,
          marginTop: 1,
          p: 2,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <RHFTextField
          name="amount"
          label={t("business_builder.subscriptions.filter.amount", {
            symbol: symbol,
          })}
          size="small"
        />
        <RHFSelect
          name="business_builder_id"
          label="business_builder.subscriptions.filter.builder"
          size="small"
        >
          <option />
          {businessBuilders?.map(({ id, name }) => (
            <option value={id}>{name}</option>
          ))}
        </RHFSelect>
        <RHFSelect
          name="period_month"
          label="business_builder.subscriptions.filter.period"
          size="small"
        >
          <option />
          <option value="1 month">
            {t("global.month_count", { count: 1 })}
          </option>
          <option value="2 month">
            {t("global.month_count", { count: 3 })}
          </option>
          <option value="3 month">
            {t("global.month_count", { count: 6 })}
          </option>
          <option value="4 month">
            {t("global.month_count", { count: 12 })}
          </option>
        </RHFSelect>
        <Collapse in={openCoin}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
              },
            }}
          >
            <Coin />
          </Box>
        </Collapse>
        <Collapse in={Boolean(coin_id)}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            endIcon={<Iconify icon="eva:chevron-right-fill" />}
            name="pay-now"
          >
            {"userBusinessBuilder.subscription.payNow"}
          </Button>
        </Collapse>
      </Box>
    </FormProvider>
  );
};

export default PayNow;
