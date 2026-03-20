import React from "react";
import { Box, Stack } from "@mui/material";
import Item from "../rankProgressBar/item";
import PreviousLargestOrder from "./previousLargestOrder";
import PreviousCustomerDetails from "./previousCustomerDetails";
import { useTranslation } from "react-i18next";

const Previous = ({ higherRank, state }) => {
  const { t } = useTranslation();
  if (!higherRank) return null;

  return (
    <Box>
      <Stack spacing={0.5}>
        <Item
          title={t("affiliate_dashboard.personal_order_qv")}
          required={Number(higherRank?.personal_order_qv)}
          completed={Number(higherRank?.prev_personal_qv)}
          status={Number(higherRank?.prev_personal_qv) >= Number(higherRank?.personal_order_qv)}
        />
        <Item
          title={t("affiliate_dashboard.required_customers")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.prev_customer_count)}
          status={Number(higherRank?.prev_customer_count) >= Number(higherRank?.required_customers)}
        />
        <Item
          title={t("affiliate_dashboard.no_of_customers_with_30_qv")}
          required={Number(higherRank?.required_customers)}
          completed={Number(higherRank?.prev_qualified_customer_count)}
          status={Number(higherRank?.prev_qualified_customer_count) >= Number(higherRank?.required_customers)}
        />
      </Stack>
      <PreviousCustomerDetails state={state} customerDetails={higherRank?.prev_customers_largest_orders} />
      <PreviousLargestOrder state={state} order={higherRank?.prev_largest_orders} />
    </Box>
  );
};

export default Previous;
