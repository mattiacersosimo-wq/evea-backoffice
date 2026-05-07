import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useOutletContext } from "react-router";
import Iconify from "src/components/Iconify";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";
import { defaultReportFilter } from "./hooks/use-filter";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const ReportFilter = ({ getReport, sum, isJoining, isPoint, hideUserFilter, extraFilters }) => {
  const { methods } = useOutletContext();
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = async (inputData) => {
    await getReport(1, inputData);
  };

  const reset = () => methods.reset(defaultReportFilter);
  useEffect(() => {
    return () => reset();
  }, []);

  const extras = Array.isArray(extraFilters) ? extraFilters : [];
  const baseCols = 2 + (hideUserFilter ? 0 : 1) + extras.length + 2;
  const totalCols = isJoining || isPoint ? baseCols : baseCols + 1;

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
                sm: `repeat(${totalCols}, 1fr)`,
              },
            }}
          >
            <RHFDatePicker label="date.start" size="small" name="start_date" />
            <RHFDatePicker label="date.end" size="small" name="end_date" />
            {!hideUserFilter && <Users name="user_id" label="search.user" size="small" />}

            {extras.map((f) => (
              <Controller
                key={f.name}
                name={f.name}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    label={f.label}
                    value={field.value ?? (f.allValue ?? "")}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value={f.allValue ?? ""}><em>{f.allLabel || "Tutti"}</em></MenuItem>
                    {(f.options || []).map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            ))}

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
              sx={{ height: "40px" }}
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
