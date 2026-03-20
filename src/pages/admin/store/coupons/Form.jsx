import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack } from "@mui/material";

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import Products from "src/components/auto-complete/products";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit }) => {
  const {
    formState: { isSubmitting, errors },
  } = methods;
  const { t } = useTranslation();
  return (
    <Grid item xs={12} md={12}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
              },
            }}
          >
            <RHFTextField name="name" label={"coupons.add_form.coupon_name"} />
            <RHFTextField name="code" label={"coupons.add_form.code"} />
            <RHFSelect name="type" label={"coupons.add_form.type"}>
              <option value="" />
              <option value="Fixed">
                {t("coupons.add_form.fixed_amount")}
              </option>
              {/* <option value="Percentage">
                {t("coupons.add_form.percentage")}
              </option> */}
            </RHFSelect>
            <RHFTextField name="discount" label={"coupons.add_form.discount"} />
            <RHFTextField
              onWheel={(e) => e.target.blur()}
              name="total_amount"
              label={"coupons.add_form.total_amount"}
              type="number"
            />
            <RHFSelect name="active" label={"coupons.add_form.status"}>
              <option value={1}>{t("coupons.add_form.enabled")}</option>
              <option value={0}>{t("coupons.add_form.disabled")}</option>
            </RHFSelect>
            <RHFTextField
              onWheel={(e) => e.target.blur()}
              type="number"
              name="uses_per_coupon"
              label={"coupons.add_form.usesPerCoupon"}
            />
            <RHFTextField
              onWheel={(e) => e.target.blur()}
              type="number"
              name="uses_per_customer"
              label={"coupons.add_form.usesPerCustomer"}
            />
          </Box>

          {/* <Box
            sx={{
              mt: 3,
              width: { xs: "100%", sm: "50%" },
            }}
          >
            <Products
              name="product_id"
              multiple
              label={<Translate>global.product</Translate>}
            />
          </Box> */}
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
              mt: 3,
            }}
          >
            <RHFDatePicker label={"coupons.add_form.from"} name="start_date" />

            <RHFDatePicker label={"coupons.add_form.to"} name="end_date" />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              name="submit"
            >
              <Translate>coupons.add_form.submit</Translate>
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Grid>
  );
};

export default Form;
