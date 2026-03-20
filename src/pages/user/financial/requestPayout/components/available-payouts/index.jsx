import { Box } from "@mui/material";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { RHFSelect } from "src/components/hook-form";
import useAvailablePayouts from "./hooks/use-available-payout";

const AvailablePayouts = () => {
  const availablePayouts = useAvailablePayouts();
  const { setValue, watch } = useFormContext();

  const paymentType = watch("payment_type");

  const isDisabled = useMemo(() => {
    if (availablePayouts?.length === 1 && paymentType === "") {
      setValue("payment_type", availablePayouts?.find(Boolean)?.id);
      return true;
    }
    return false;
  }, [availablePayouts, paymentType]);

  return (
    <Box>
      <RHFSelect
        name="payment_type"
        label="financial.payout.request.methods"
        size="small"
        disabled={isDisabled}
      >
        <option />
        {availablePayouts.map(({ id, name }) => (
          <option value={id}>{name}</option>
        ))}
      </RHFSelect>
    </Box>
  );
};

export default AvailablePayouts;
