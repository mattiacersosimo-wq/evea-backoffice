import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { FormProvider, RHFSwitch } from "src/components/hook-form";
import Translate from "src/components/translate";
import useUpdateConfig from "../../hooks/use-update-config";

const TwoFactorAuthentication = () => {
  const { methods, onSubmit } = useUpdateConfig("2fa_enable");

  return (
    <>
      <Box sx={{ marginTop: 3, maxWidth: "300px" }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={1}>
            <RHFSwitch
              label="settings.advanced_settings.2fa.show"
              name="status"
            />

            <Box
              sx={{
                width: "100%",
                textAlign: "right",
              }}
            >
              <LoadingButton
                loading={methods.formState.isSubmitting}
                type="submit"
                variant="contained"
              >
                <Translate>settings.advanced_settings.2fa.update</Translate>
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </Box>

      <Typography variant="body2" mt={3} color="GrayText">
        <Translate>settings.advanced_settings.2fa.message</Translate>
      </Typography>
    </>
  );
};

export default TwoFactorAuthentication;
