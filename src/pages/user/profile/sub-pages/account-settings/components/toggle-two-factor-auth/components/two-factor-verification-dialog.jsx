import { useFormContext } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";

const TwoFactorVerificationDialog = ({ qrCode = null }) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const { t } = useTranslation();

  return (
    <>
      <DialogTitle
        sx={{
          mb: 2,
        }}
      >
        <Translate>profile.settings.2fa.title</Translate>
      </DialogTitle>
      <DialogContent
        sx={{
          paddingBottom: 0,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" gutterBottom>
            <Translate>profile.settings.2fa.enable_message</Translate>
          </Typography>
        </Box>

        {qrCode}

        <TextField
          helperText={errors?.code?.message}
          error={Boolean(errors?.code)}
          autoFocus
          {...register("code")}
          size="small"
          fullWidth
          label={t("profile.settings.2fa.otp")}
          type="number"
        />

        {/* <DialogActions> */}
        <LoadingButton
          sx={{
            mt: 1,
            mb: 2,
          }}
          type="submit"
          loading={isSubmitting}
          size="small"
          fullWidth
          variant="contained"
        >
          <Translate>profile.settings.2fa.button</Translate>
        </LoadingButton>

        <br />
        <Typography
          variant="caption"
          sx={{
            fontStyle: "italic",
          }}
        >
          <Translate>profile.settings.2fa.post_script</Translate>
        </Typography>
      </DialogContent>
      <DialogActions />
    </>
  );
};

export default TwoFactorVerificationDialog;
