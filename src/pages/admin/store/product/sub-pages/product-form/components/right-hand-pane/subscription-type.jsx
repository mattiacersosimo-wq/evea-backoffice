import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import Map from "src/components/map";

import LabelStyle from "../../../../../../../../components/label-style";
import { useTranslation } from "react-i18next";

const types = [
  // {
  //   name: "products.add.subscription",
  //   value: "subscription",
  // },
  {
    name: "products.add.one_off_payment",
    value: "one-off-payment",
  },
];

const SubscriptionTypes = () => {
  const { watch, setValue } = useFormContext();
  const subscriptionType = watch("subscription_type");
  const { t } = useTranslation();
  return (
    <Card sx={{ p: 3 }}>
      <FormControl>
        <LabelStyle>{t("products.add.subscription_or")}</LabelStyle>
        <RadioGroup
          value={subscriptionType}
          aria-labelledby="product-subscription-type"
          name="product-payment-methods"
          onChange={(e) => setValue("subscription_type", e.target.value)}
        >
          <Stack spacing={1} direction="row">
            <Map
              list={types}
              render={({ name, value }) => (
                <FormControlLabel
                  value={value}
                  control={<Radio />}
                  label={t(name)}
                />
              )}
            />
          </Stack>
        </RadioGroup>
      </FormControl>
    </Card>
  );
};

export default SubscriptionTypes;
