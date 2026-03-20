import { Card, Stack } from "@mui/material";
import { RHFRadioGroup } from "src/components/hook-form";

import LabelStyle from "../../../../../../../../components/label-style";

const PaymentMethods = () => {
  const SUB_ONE = [
    "adminStore.products.subscription",
    "adminStore.products.oneOffPayment",
  ];
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1}>
        <LabelStyle>{"adminStore.products.subscriptionOR"}</LabelStyle>
        <RHFRadioGroup
          name="subscription_type"
          options={SUB_ONE}
          sx={{
            "& .MuiFormControlLabel-root": { mr: 4 },
          }}
        />
      </Stack>
    </Card>
  );
};

export default PaymentMethods;
