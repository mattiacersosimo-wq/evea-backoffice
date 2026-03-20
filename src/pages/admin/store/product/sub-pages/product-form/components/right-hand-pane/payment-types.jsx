import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { TYPE_IDS } from "src/utils/types";
import LabelStyle from "../../../../../../../../components/label-style";
import usePaymentTypes from "../../../../hook/usePaymentTypes";

const PaymentTypes = () => {
  const { setValue, watch } = useFormContext();
  const types = usePaymentTypes();

  const savedTypes = watch("payment_types");

  useEffect(() => {
    if (savedTypes.length === 0) {
      setValue("payment_types", [TYPE_IDS.finPay]);
    }
  }, [savedTypes]);
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <LabelStyle>{"adminStore.products.paymentType"}</LabelStyle>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {types.map(({ id, name }) => {
              const isChecked = savedTypes?.includes(id);
              return (
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox
                      checked={isChecked}
                      disabled={isChecked && savedTypes.length === 1}
                      name={name}
                      onChange={() => {
                        const current = [...savedTypes];
                        const index = current.findIndex((item) => item === id);
                        if (index < 0) {
                          setValue("payment_types", [...current, id]);
                        } else {
                          current.splice(index, 1);
                          setValue("payment_types", current);
                        }
                      }}
                    />
                  }
                  label={name}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Stack>
    </Card>
  );
};

export default PaymentTypes;
