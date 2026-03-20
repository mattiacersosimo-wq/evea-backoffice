import React from "react";
import { RHFSelect } from "src/components/hook-form";
import useAvailablePayout from "src/pages/admin/settings/withdrawal/components/available-payout/hooks/use-available-payout";

const PayoutMethods = () => {
  const payoutMethods = useAvailablePayout();

  return (
    <RHFSelect name="payout_type" label="search.payout_type" size="small">
      <option value="" />
      {payoutMethods?.map(({ id, name }) => (
        <option value={id}>{name}</option>
      ))}
    </RHFSelect>
  );
};

export default PayoutMethods;
