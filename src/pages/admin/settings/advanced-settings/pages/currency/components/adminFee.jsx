import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import useLocales from "src/hooks/useLocales";

import i18n from "src/locales/i18n";

const AdminFee = ({ fee, openDays = [], handleChange }) => {
  const _weekDays = [
    i18n.t("adminSettings.network.monday"),
    i18n.t("adminSettings.network.tuesday"),
    i18n.t("adminSettings.network.wednesday"),
    i18n.t("adminSettings.network.thursday"),
    i18n.t("adminSettings.network.friday"),
    i18n.t("adminSettings.network.saturday"),
    i18n.t("adminSettings.network.sunday"),
  ];
  const { translate } = useLocales();
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {translate("adminSettings.network.withdrawalAdmin")}
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={fee}
        name="admin_fee_percent"
        onChange={handleChange()}
      />
      <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontSize: "0.8rem" }}>
        {translate("adminSettings.network.openWithdrawalsOn")}
      </Typography>

      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {_weekDays.map((day) => {
            const isActive = openDays.includes(capitalCase(day));
            return (
              <FormControlLabel
                value={day}
                control={
                  <Radio
                    size="small"
                    checked={isActive}
                    onClick={handleChange("open")}
                  />
                }
                label={capitalCase(day)}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default AdminFee;
