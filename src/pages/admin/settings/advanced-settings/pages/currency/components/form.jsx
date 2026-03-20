import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";

const Form = ({ methods, onSubmit, buttonLabel, handleClose }) => {
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent>
        <DialogContentText>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <RHFTextField label="settings.currency.name" name="name" />
            <RHFTextField label="settings.currency.code" name="code" />
            <RHFTextField label="settings.currency.symbol" name="symbol" />
            <RHFTextField
              label="settings.currency.exchange_rate"
              name="exchange_rate"
            />
            <RHFSelect label="settings.currency.status" name="is_enable">
              <option value={1}>{t("settings.currency.enabled")}</option>
              <option value={0}> {t("settings.currency.disabled")}</option>
            </RHFSelect>
          </Box>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="error">
          <Translate>settings.currency.cancel</Translate>
        </Button>
        <LoadingButton
          loading={methods.formState.isSubmitting}
          type="submit"
          variant="contained"
        >
          {buttonLabel}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

export default Form;
