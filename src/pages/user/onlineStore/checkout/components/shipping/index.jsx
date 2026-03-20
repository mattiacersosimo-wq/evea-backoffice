import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useShippingForm from "./hooks/useShippingForm";
import { PATH_USER } from "src/routes/paths";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import Countries from "./countries";
import { useEffect, useState } from "react";
import { fetchCart } from "../cart/hooks/useCartList";

const ShippingForm = () => {
  const [cartId, setCartId] = useState("");
  const { methods, onSubmit } = useShippingForm(cartId);
  const { watch, setValue } = methods;
  const shippingAddress = watch("shippingAddress");

  const getCart = async () => {
    const data = await fetchCart();
    const ids = data.map((item) => item.id);
    setCartId(ids);
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="billing_first_name" label="First name" />
                <RHFTextField name="billing_last_name" label="Last name" />
                <Countries
                  name="billing_country"
                  codeField="billing_country_code"
                />
                <RHFTextField
                  name="billing_street_address"
                  label="Street address"
                />
                <RHFTextField name="billing_postcode" label="Zip code" />
                <RHFTextField name="billing_city" label="Town / City" />
                <RHFTextField name="billing_province" label="Province" />

                <RHFTextField name="billing_email" label="Email address" />
                <RHFTextField name="billing_phone" label="Phone number" />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shippingAddress}
                      onChange={(e) =>
                        setValue("shippingAddress", e.target.checked)
                      }
                    />
                  }
                  label="Ship to a different address?"
                />
                {shippingAddress && (
                  <Stack spacing={2}>
                    <RHFTextField
                      name="shipping_first_name"
                      label="First name"
                    />
                    <RHFTextField name="shipping_last_name" label="Last name" />
                    <Countries
                      name="shipping_country"
                      codeField="shpping_country_code"
                    />
                    <RHFTextField
                      name="shipping_street_address"
                      label="Street address"
                    />
                    <RHFTextField name="shipping_postcode" label="Zip code" />
                    <RHFTextField name="shipping_city" label="Town / City" />
                    <RHFTextField name="shipping_province" label="Province" />
                    <RHFTextField name="shipping_email" label="Email address" />
                    <RHFTextField name="shipping_phone" label="Phone number" />
                  </Stack>
                )}
                <Button type="submit" variant="contained">
                  Continue to Payment
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 3 }}
          LinkComponent={Link}
          to={PATH_USER.onlineStore.productSubscription.checkout}
          size="small"
          color="inherit"
          startIcon={<Iconify icon={"eva:arrow-ios-back-fill"} />}
        >
          <Translate>user.online_store.product.back</Translate>{" "}
        </Button>
      </FormProvider>
    </>
  );
};

export default ShippingForm;
