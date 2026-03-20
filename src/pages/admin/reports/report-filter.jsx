import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useOutletContext } from "react-router";
import Iconify from "src/components/Iconify";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";
import { defaultReportFilter } from "./hooks/use-filter";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const ReportFilter = ({ getReport, sum, isJoining, isPoint }) => {
  const { methods } = useOutletContext();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (inputData) => {
    await getReport(1, inputData);
  };

  const reset = () => methods.reset(defaultReportFilter);
  useEffect(() => {
    return () => reset();
  }, []);
  return (
    <FilterBar>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1,1fr)",
                sm: isJoining ? "repeat(5, 1fr)" : "repeat(6, 1fr)",
              },
            }}
          >
            <RHFDatePicker label="date.start" size="small" name="start_date" />
            <RHFDatePicker label="date.end" size="small" name="end_date" />
            <Users name="user_id" label="search.user" size="small" />

            <LoadingButton
              loading={isSubmitting}
              size="small"
              variant="contained"
              type="submit"
              sx={{ height: "40px" }}
            >
              <Translate>search.search</Translate>
            </LoadingButton>

            <Button
              size="small"
              variant="outlined"
              sx={{ height: "40px", width: "90px" }}
              onClick={() => {
                reset();
                getReport(1);
              }}
              endIcon={<Iconify icon="bx:reset" />}
            >
              <Translate>global.reset</Translate>
            </Button>
            {isJoining || isPoint ? null : (
              <Box textAlign="right">
                <Typography color="#00B13B">
                  <Currency>{parseInt(sum)}</Currency>
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <Translate>global.total_amount</Translate>
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </FormProvider>
    </FilterBar>
  );
};

export default ReportFilter;
