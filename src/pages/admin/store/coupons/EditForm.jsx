import { LoadingButton } from "@mui/lab";
import DatePicker from "@mui/lab/DatePicker";
import { Box, Card, Grid, Stack, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import ProductAutoComplete from "./components/productAutoComplete";

const EditForm = ({ methods, onSubmit }) => {
  const {
    control,
    formState: { isSubmitting, errors },
  } = methods;

  return (
    <Grid item xs={12} md={12}>
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <RHFTextField name="name" label={"adminStore.coupons.couponName"} />
            <RHFTextField name="code" label={"adminStore.coupons.code"} />
            <RHFSelect name="type" label={"adminStore.coupons.type"}>
              <option value="" />
              <option value="Fixed">{"adminStore.coupons.fixedAmount"}</option>
              <option value="Percentage">
                {"adminStore.coupons.percentage"}
              </option>
            </RHFSelect>
            <RHFTextField
              name="discount"
              label={"adminStore.coupons.discount"}
            />
            <RHFTextField
              name="total_amount"
              label={"adminStore.coupons.totalAmount"}
            />
            <RHFSelect name="active" label={"adminStore.coupons.status"}>
              <option value={1}>{"adminStore.coupons.enabled"}</option>
              <option value={0}>{"adminStore.coupons.disabled"}</option>
            </RHFSelect>
            <RHFTextField
              type="number"
              name="uses_per_coupon"
              label={"adminStore.coupons.usesPerCoupon"}
            />
            <RHFTextField
              type="number"
              name="uses_per_customer"
              label={"adminStore.coupons.usesPerCustomer"}
            />
          </Box>

          <Box
            sx={{
              mt: 3,
              width: "50%",
            }}
          >
            <ProductAutoComplete name="product_ids" />
            {/* <MultipleProductAutoComplete
              onChange={(_, item) =>
                methods.setValue(
                  "product_ids",
                  item.map(({ id }) => id)
                )
              }
            /> */}
          </Box>
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
            <Controller
              control={control}
              name="start_date"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  disablePast
                  label={"adminStore.coupons.from"}
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="end_date"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  disablePast
                  label={"adminStore.coupons.to"}
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              name="submit"
            >
              {"adminStore.coupons.submit"}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Grid>
  );
};

export default EditForm;
