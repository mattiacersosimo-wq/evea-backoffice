import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import GetReport from "src/components/getReport";
import { FormProvider, RHFSelect } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Translate from "src/components/translate";
import Users from "src/components/users";

const Filter = ({ methods, onFilter }) => {
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

            <Users
              label={"holding_tank.userName"}
              name="user_id"
              size="small"
            />

            <RHFSelect
              name="active"
              label={"holding_tank.account_status"}
              size="small"
            >
              <option value="" />
              <option value={1}>{t("holding_tank.active")}</option>
              <option value={0}>{t("holding_tank.blocked")}</option>
            </RHFSelect>
            <GetReport size="medium" />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default Filter;
