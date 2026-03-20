import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { FormProvider, RHFSwitch } from "src/components/hook-form";
import Translate from "src/components/translate";
import useUpdateConfig from "../../hooks/use-update-config";

const KYCEnable = () => {
  const { methods, onSubmit } = useUpdateConfig("kyc_enable");

  return (
    <>
      <Box sx={{ marginTop: 3, maxWidth: "300px" }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={1}>
            <RHFSwitch
              label="settings.advanced_settings.kyc.show"
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
                <Translate>settings.advanced_settings.leads.update</Translate>
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </Box>

      <Typography variant="body2" mt={3} color="GrayText">
        <Translate>settings.advanced_settings.kyc.message</Translate>
      </Typography>
    </>
  );
};

export default KYCEnable;
