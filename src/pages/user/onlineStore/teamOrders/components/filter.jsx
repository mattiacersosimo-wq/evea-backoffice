import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const fmt = (d) => d.toISOString().split("T")[0];

const DataFilter = ({ methods, onFilter }) => {
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const { setValue, formState: { isSubmitting }, handleSubmit } = methods;

  const applyPreset = (preset) => {
    const today = new Date();
    let start, end = today;
    switch (preset) {
      case "today": start = today; break;
      case "7d": start = new Date(today); start.setDate(today.getDate() - 7); break;
      case "30d": start = new Date(today); start.setDate(today.getDate() - 30); break;
      case "month": start = new Date(today.getFullYear(), today.getMonth(), 1); break;
      case "prevMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "year": start = new Date(today.getFullYear(), 0, 1); break;
      default: return;
    }
    setValue("start_date", fmt(start), { shouldValidate: true });
    setValue("end_date", fmt(end), { shouldValidate: true });
    handleSubmit(onFilter)();
  };

  const resetFilter = () => {
    setValue("start_date", "", { shouldValidate: true });
    setValue("end_date", "", { shouldValidate: true });
    setValue("user_id", "", { shouldValidate: true });
    handleSubmit(onFilter)();
  };

  const presets = [
    { k: "today", l: isIt ? "Oggi" : "Today" },
    { k: "7d", l: isIt ? "7 giorni" : "7 days" },
    { k: "30d", l: isIt ? "30 giorni" : "30 days" },
    { k: "month", l: isIt ? "Mese corrente" : "Current month" },
    { k: "prevMonth", l: isIt ? "Mese scorso" : "Last month" },
    { k: "year", l: isIt ? "Anno" : "Year" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: "1px solid #f0ece6", bgcolor: alpha(ORO, 0.02) }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onFilter)}>
        {/* Preset rapidi */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 0.8 }}>
          <Typography sx={{ fontSize: "0.72rem", color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, mr: 0.5 }}>
            {isIt ? "Periodo rapido" : "Quick range"}
          </Typography>
          {presets.map((p) => (
            <Chip key={p.k} label={p.l} size="small"
              onClick={() => applyPreset(p.k)}
              sx={{
                height: 26, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                bgcolor: alpha(ORO, 0.08), color: ESPRESSO,
                border: `1px solid ${alpha(ORO, 0.2)}`,
                transition: "all .2s ease",
                "&:hover": { bgcolor: ORO, color: "#fff", borderColor: ORO },
              }} />
          ))}
        </Stack>

        {/* Campi filtro */}
        <Box
          sx={{
            display: "grid", columnGap: 2, rowGap: 2,
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "2fr 2fr 3fr auto auto" },
            alignItems: "end",
          }}
        >
          <RHFDatePicker name="start_date" label={isIt ? "Dal" : "From"} size="small" />
          <RHFDatePicker name="end_date" label={isIt ? "Al" : "To"} size="small" />
          <Users label={isIt ? "Utente" : "User"} name="user_id" size="small" />
          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            loading={isSubmitting}
            startIcon={<Iconify icon="mdi:filter-outline" />}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, height: 40, px: 2.5 }}
          >
            {isIt ? "Filtra" : "Filter"}
          </LoadingButton>
          <Button
            onClick={resetFilter}
            size="medium"
            startIcon={<Iconify icon="mdi:refresh" />}
            sx={{ color: MUTED, fontWeight: 600, textTransform: "none", borderRadius: 2, height: 40, px: 2, "&:hover": { bgcolor: alpha(MUTED, 0.08) } }}
          >
            {isIt ? "Reset" : "Reset"}
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default DataFilter;
