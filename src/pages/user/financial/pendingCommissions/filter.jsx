import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import amountTypeOptions from "src/components/e-wallet-amount-types/_options";

var MONTH_KEYS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

var YEARS = [2024, 2025, 2026];

var DataFilter = function (props) {
  var month = props.month;
  var year = props.year;
  var paymentType = props.paymentType;
  var onMonthChange = props.onMonthChange;
  var onYearChange = props.onYearChange;
  var onPaymentTypeChange = props.onPaymentTypeChange;
  var onApply = props.onApply;

  var { t } = useTranslation();

  return (
    <Grid item xs={12} sx={{ p: 2, mb: 2, mt: 1 }}>
      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 2,
          alignItems: "center",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        <FormControl size="small">
          <InputLabel>{t("common.month")}</InputLabel>
          <Select
            value={month}
            label={t("common.month")}
            onChange={function (e) { onMonthChange(e.target.value); }}
          >
            {MONTH_KEYS.map(function (k, i) {
              return (
                <MenuItem key={i} value={i + 1}>
                  {t("month_long." + k)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>{t("common.year")}</InputLabel>
          <Select
            value={year}
            label={t("common.year")}
            onChange={function (e) { onYearChange(e.target.value); }}
          >
            {YEARS.map(function (y) {
              return (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>{t("search.amount_type")}</InputLabel>
          <Select
            value={paymentType}
            label={t("search.amount_type")}
            onChange={function (e) { onPaymentTypeChange(e.target.value); }}
          >
            {amountTypeOptions.map(function (opt) {
              return (
                <MenuItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onApply}
          sx={{
            backgroundColor: "#B8963B",
            height: 40,
            "&:hover": { backgroundColor: "#967A2F" },
          }}
        >
          {t("common.apply")}
        </Button>
      </Box>
    </Grid>
  );
};

export default DataFilter;
