import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import Iconify from "src/components/Iconify";
import FilterBar from "src/components/filterBar";
import { FormProvider } from "src/components/hook-form";
import Users from "src/components/users";
import { defaultReportFilter } from "./hooks/use-filter";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i); // current + 5 anni indietro

const ReportFilter = ({ getReport, sum, isJoining, isPoint, hideUserFilter, extraFilters }) => {
  const { t } = useTranslation();
  const MONTHS = [
    { value: 1, label: t("month_long.jan", "Gennaio") },
    { value: 2, label: t("month_long.feb", "Febbraio") },
    { value: 3, label: t("month_long.mar", "Marzo") },
    { value: 4, label: t("month_long.apr", "Aprile") },
    { value: 5, label: t("month_long.may", "Maggio") },
    { value: 6, label: t("month_long.jun", "Giugno") },
    { value: 7, label: t("month_long.jul", "Luglio") },
    { value: 8, label: t("month_long.aug", "Agosto") },
    { value: 9, label: t("month_long.sep", "Settembre") },
    { value: 10, label: t("month_long.oct", "Ottobre") },
    { value: 11, label: t("month_long.nov", "Novembre") },
    { value: 12, label: t("month_long.dec", "Dicembre") },
  ];
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
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  size="small"
                  label={t("common.month", "Mese")}
                  value={field.value ?? ""}
                >
                  {MONTHS.map((m) => (
                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  size="small"
                  label={t("common.year", "Anno")}
                  value={field.value ?? ""}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </TextField>
              )}
            />
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
                    <MenuItem value={f.allValue ?? ""}><em>{f.allLabel || t("admin.reports.filter_all", "Tutti")}</em></MenuItem>
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
