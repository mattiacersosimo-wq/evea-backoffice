import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import GetReport from "src/components/getReport";
import { FormProvider, RHFSelect } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";
import PayoutMethods from "./payout-methods";

const DataFilter = ({ fetchData, methods }) => {
  const onSubmit = methods.handleSubmit(async (inputData) => {
    await fetchData(1, inputData);
  });
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12} md={12} sx={{ p: 2, mb: 2, mt: 1 }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(6, 1fr)",
              },
            }}
          >
            <RHFDatePicker label="date.start" name="start_date" size="small" />
            <RHFDatePicker label="date.end" name="end_date" size="small" />
            <Users label="global.user" name="user_id" size="small" />
            <RHFSelect name="status" label="search.status" size="small">
              <option value="" />
              <option value="approved">{t("payout_status.approved")}</option>
              <option value="rejected">{t("payout_status.rejected")}</option>
            </RHFSelect>
            <PayoutMethods />
            <GetReport />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
