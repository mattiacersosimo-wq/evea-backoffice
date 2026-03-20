import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import DepositWalletAmountType from "src/components/deposit-wallet-amount-type";
import GetReport from "src/components/getReport";
import { FormProvider, RHFSelect } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";

const DataFilter = ({ isKyc, methods, onFilter }) => {
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
                sm: "repeat(5, 1fr)",
              },
            }}
          >
            <RHFDatePicker name="start_date" label="date.start" size="small" />
            <RHFDatePicker name="end_date" label="date.end" size="small" />

            <Users isKyc label="global.username" name="user_id" size="small" />
            <RHFSelect name="status" label={"search.status"} size="small">
              <option value="" />
              <option value="pending">{t("global.pending")}</option>
              <option value="approved">{t("payout_status.approved")}</option>
              <option value="rejected">{t("payout_status.rejected")}</option>
            </RHFSelect>
            <GetReport size="medium" />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
