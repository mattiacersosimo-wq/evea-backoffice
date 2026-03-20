import { Box, Grid } from "@mui/material";
import EWalletAmountTypes from "src/components/e-wallet-amount-types";
import GetReport from "src/components/getReport";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";

const DataFilter = ({ methods, onFilter }) => {
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
            <EWalletAmountTypes />
            <GetReport size="medium" />
          </Box>
        </FormProvider>
      </Grid>
    </>
  );
};

export default DataFilter;
