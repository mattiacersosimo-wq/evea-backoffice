import { LoadingButton } from "@mui/lab";
import { Box, Card, Stack, useMediaQuery } from "@mui/material";
import { FormProvider } from "react-hook-form";
import UsersSearch from "src/components/autoComplete/users";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Ternary from "src/components/ternary";
import TransferHistory from "src/pages/admin/financial/fundCredit/components/data-table/index.jsx";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import DataFilter from "src/pages/admin/financial/fundCredit/components/data-table/components/dataFilter.js";
import {
  getSelectedSymbol,
  useGetCurrencySymbol,
} from "src/components/with-prefix";
import { isMenuActive } from "src/utils/actionProtector";
import useAddForm from "./hooks/useAddForm";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    deduct: test("deduct"),
  };
};

const FormFund = ({ method, state, fetchData, rowStart, ...rest }) => {
  const status = genStatus("nav.financial.title", "nav.financial.fund_credit");

  const { isDebit, methods, onSubmit } = useAddForm(fetchData);

  const {
    formState: { isSubmitting },
  } = methods;

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const { t } = useTranslation();

  const currency = useGetCurrencySymbol();

  return (
    <Ternary
      when={status.add || status.deduct}
      then={
        <>
          <Card sx={{ p: 3 }}>
            <FormProvider {...methods}>
              <Box
                sx={{
                  display: "grid",
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                  mb: 2,
                }}
              >
                <UsersSearch name="user_id" props={{ size: "medium" }} />
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
                  mb: 2,
                }}
              >
                <RHFTextField
                  name="amount"
                  type="number"
                  label={t("financial.fund_credit.form.amount", {
                    symbol: currency,
                  })}
                  onWheel={(e) => e.target.blur()}
                />
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
                  mb: 2,
                }}
              >
                <RHFSelect
                  name="wallet_type"
                  label="financial.fund_credit.form.to"
                >
                  <option value="" />
                  <option value="ewallet">{t("global.e_wallet")}</option>
                  <option value="deposit_wallet">{t("global.d_wallet")}</option>
                </RHFSelect>
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
                  mb: 2,
                }}
              >
                <RHFTextField
                  simple
                  name="notes"
                  multiline
                  fullWidth
                  rows={3}
                  label="financial.fund_credit.form.note"
                />
              </Box>

              <Stack alignItems="flex-start" sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: "repeat(2, 1fr)",
                    mb: 2,
                  }}
                >
                  <Ternary
                    when={status.add}
                    then={
                      <LoadingButton
                        {...buttonProps}
                        type="submit"
                        variant="outlined"
                        onClick={methods.handleSubmit(onSubmit(true))}
                        name="deduct-amount"
                        loading={isDebit && isSubmitting}
                      >
                        <Translate>financial.fund_credit.form.deduct</Translate>
                      </LoadingButton>
                    }
                  />

                  <Ternary
                    when={status.deduct}
                    then={
                      <LoadingButton
                        {...buttonProps}
                        type="submit"
                        variant="contained"
                        onClick={methods.handleSubmit(onSubmit(false))}
                        name="add-amount"
                        loading={!isDebit && isSubmitting}
                      >
                        <Translate>financial.fund_credit.form.add</Translate>
                      </LoadingButton>
                    }
                  />
                </Box>
              </Stack>
            </FormProvider>
          </Card>
          <DataFilter methods={method} fetchData={fetchData} />
          <TransferHistory
            state={state}
            fetchData={fetchData}
            rowStart={rowStart}
            {...rest}
          />
        </>
      }
    />
  );
};

export default FormFund;
