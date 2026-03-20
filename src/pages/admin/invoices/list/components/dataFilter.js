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

const DataFilter = ({ methods, onFilter }) => {
  const types = usePaymentTypes();
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
              name="payment_type_id"
            >
              <option value={null} />
              <Map
                list={types}
                render={({ name, id }) => <option value={id}>{name}</option>}
              />
            </RHFSelect>
            <RHFSelect name="status" label={"search.status"} size="small">
              <option value="" />
              <option value="finished">{t("global.completed")}</option>
              <option value="cancelled">{t("global.cancelled")}</option>
              <option value="refunded">{t("global.refunded")}</option>
              <option value="failed">{t("global.failed")}</option>
            </RHFSelect>
            <RHFTextField
              label="global.invoice_id"
              name="invoice_id"
              size="small"
            />
            <GetReport size="medium" />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
