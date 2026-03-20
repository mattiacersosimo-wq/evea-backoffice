import React from "react";
import { Box, Stack } from "@mui/material";
import Item from "../rankProgressBar/item";
import CurrentLargestOrder from "./currentLargestOrder";
import CurrentCustomerDetails from "./currentCustomerDetails";
import { useTranslation } from "react-i18next";

const Current = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  return (
    <Box>
      <Stack spacing={0.5}>
        <Item
          title={t("affiliate_dashboard.personal_order_qv")}
          required={Number(higherRank?.personal_order_qv)}
          completed={Number(higherRank?.current_personal_qv)}
          status={Number(higherRank?.current_personal_qv) >= Number(higherRank?.personal_order_qv)}
        />
        <Item
          title={t("affiliate_dashboard.required_customers")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.current_customer_count)}
          status={Number(higherRank?.current_customer_count) >= Number(higherRank?.required_customers)}
        />
        <Item
          title={t("affiliate_dashboard.no_of_customers_with_30_qv")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.current_qualified_customer_count)}
          status={Number(higherRank?.current_qualified_customer_count) >= Number(higherRank?.required_customers)}
        />
      </Stack>
      <CurrentCustomerDetails state={state} customerDetails={higherRank?.current_customers_largest_orders} />
      <CurrentLargestOrder state={state} order={higherRank?.current_largest_orders} />
    </Box>
  );
};

export default Current;
