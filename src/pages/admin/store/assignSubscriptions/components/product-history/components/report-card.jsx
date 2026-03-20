import { Box, Grid } from "@mui/material";
import Product from "src/components/Product";
import GetReport from "src/components/getReport";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";

const ReportCard = ({ methods, onFilter }) => {
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
      <Grid item xs={12} md={12}>
        <FormProvider methods={methods} onSubmit={onFilter}>
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
            <RHFDatePicker
              name="start_date"
              label={"assign_subscriptions.pickStartDate"}
              size="small"
            />
            <RHFDatePicker
              name="end_date"
              label={"assign_subscriptions.pickEndDate"}
              size="small"
            />
            <Users
              name="user_id"
              label={"assign_subscriptions.user"}
              size="small"
            />
            <RHFTextField
              name="email"
              label={"assign_subscriptions.email"}
              size="small"
            />
            <Product size="small" />
            <GetReport />
          </Box>
        </FormProvider>
      </Grid>
    </Box>
  );
};

export default ReportCard;
