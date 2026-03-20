import { Card, Typography } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

const WithdrawalText = () => {
  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          <Translate>settings.network.withdrawal_text</Translate>
        </Typography>
        <RHFTextField name="description" multiline fullWidth rows={3} />
      </Card>
    </div>
  );
};

export default WithdrawalText;
