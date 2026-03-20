import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import GetReport from "src/components/getReport";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Map from "src/components/map";
import Users from "src/components/users";
import usePaymentTypes from "src/pages/admin/store/product/hook/usePaymentTypes.js";

const DataFilter = ({ methods, fetchData }) => {
  const types = usePaymentTypes();
  const onFilter = methods.handleSubmit(
    async (inputData) => await fetchData(1, inputData)
  );
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12} md={12} sx={{ p: 2, mb: 2, mt: 1 }}>
        <FormProvider methods={methods} onSubmit={onFilter}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(4, 1fr)",
              },
            }}
          >
            <RHFDatePicker name="start_date" label="date.start" size="small" />
            <RHFDatePicker name="end_date" label="date.end" size="small" />
            <Users label="global.username" name="user_id" size="small" />
            <RHFSelect
              size="small"
              label="global.payment_type"
              name="payment_type"
            >
              <option value={null} />
              <option value="credit"> {t("global.credit")}</option>
              <option value="debit">{t("global.debit")}</option>
            </RHFSelect>
            <RHFSelect
              size="small"
              label="global.wallet_type"
              name="wallet_type"
            >
              <option value={null} />
              <option value="deposit_wallet">
                {t("global.deposit_wallet")}
              </option>
              <option value="ewallet">{t("global.ewallet")}</option>
            </RHFSelect>

            <GetReport size="medium" />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
