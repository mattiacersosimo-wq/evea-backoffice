import React from "react";
// @mui
import DatePicker from "@mui/lab/DatePicker";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import UsersSearch from "src/components/autoComplete/users";

const FilterCard = () => {
  const methods = useForm();
  const onSubmit = methods.handleSubmit((inputData) => {});
  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box>
          <Typography variant="subtitle2">
            {"userFinancial.depositWallet.walletHistory"}
          </Typography>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
              }}
            >
              <Controller
                control={control}
                name="start_date"
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={translate(
                      "userFinancial.depositWallet.pickStartDate"
                    )}
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        size="small"
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
                    label={"userFinancial.depositWallet.pickEndDate"}
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
                        size="small"
                      />
                    )}
                  />
                )}
              />

              {/* <RHFTextField
                name="userName"
                label={("userFinancial.depositWallet.Username")}
              /> */}
              <UsersSearch name="userName" props={{ size: "small" }} />

              <RHFSelect
                name="amountType"
                label={"userFinancial.depositWallet.amountType"}
                size="small"
              >
                <option value="all">{"userFinancial.depositWallet.all"}</option>
                <option value="released">
                  {"userFinancial.depositWallet.released"}
                </option>
                <option value="pending">
                  {"userFinancial.depositWallet.pending"}
                </option>
                <option value="failed">
                  {"userFinancial.depositWallet.failed"}
                </option>
                <option value="rejected">
                  {"userFinancial.depositWallet.rejected"}
                </option>
                <option value="finished">
                  {"userFinancial.depositWallet.finished"}
                </option>
                <option value="approved">
                  {"userFinancial.depositWallet.approved"}
                </option>
                <option value="fund_transfer">
                  {"userFinancial.depositWallet.fundTransfer"}
                </option>
                <option value="plan_purchase">
                  {"userFinancial.depositWallet.planPurchase"}
                </option>
                <option value="fund_transfer">
                  {"userFinancial.depositWallet.fundTransfer"}
                </option>
                <option value="self_transfer">
                  {"userFinancial.depositWallet.selfTransfer"}
                </option>
                <option value="referral_bonus">
                  {"userFinancial.depositWallet.referralBonus"}
                </option>
                <option value="achievement_bonus">
                  {"userFinancial.depositWallet.achievementBonus"}
                </option>
                <option value="first_order_bonus">
                  {"userFinancial.depositWallet.firstOrderBonus"}
                </option>
                <option value="binary_bonus">
                  {"userFinancial.depositWallet.binaryBonus"}
                </option>
                <option value="credited_by_admin">
                  {"userFinancial.depositWallet.creditedByAdmin"}
                </option>
                <option value="deducted_by_admin">
                  {"userFinancial.depositWallet.deductedByAdmin"}
                </option>
              </RHFSelect>
            </Box>
            <Box mt={2} sx={{ float: "right" }}>
              <Button variant="contained" name="get-report">
                {"getReport"}
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Card>
    </>
  );
};

export default FilterCard;
