import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { FormProvider, RHFSwitch } from "src/components/hook-form";
import Translate from "src/components/translate";
import useUpdateConfig from "../../hooks/use-update-config";

const PackagePurchase = () => {
  const { methods, onSubmit } = useUpdateConfig("default_package");

  return (
    <Box sx={{ marginTop: 3, maxWidth: "300px" }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={1}>
          <RHFSwitch
            label="settings.advanced_settings.package.show"
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
              <Translate>settings.advanced_settings.package.update</Translate>
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Box>
  );
};

export default PackagePurchase;
