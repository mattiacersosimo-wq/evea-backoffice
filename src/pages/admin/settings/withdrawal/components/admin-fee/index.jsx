import { Card, Typography } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import WeekDays from "./components/week-days";

const AdminFee = () => {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <Translate> {"settings.network.withdrawal_admin"}</Translate>
      </Typography>
      <RHFTextField fullWidth size="small" name="admin_fee_percent" />
      <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontSize: "0.8rem" }}>
        <Translate>{"settings.network.open_withdrawals_on"}</Translate>
      </Typography>
      <WeekDays />
    </Card>
  );
};

export default AdminFee;
