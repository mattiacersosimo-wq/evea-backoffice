import { LoadingButton } from "@mui/lab";
import { Box, Card, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  FormProvider,
  RHFSwitch,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import useUpdate from "./hooks/use-update";

const ConfigSettings = ({ reload }) => {
  const methods = useUpdate();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    Object.entries(inputData).forEach(([k, v]) => {
      reqData.append("code[]", k);
      reqData.append("code[]", k);
      reqData.append(`${k}[status]`, Number(v.status));
      reqData.append(`${k}[value]`, v.value);
    });

    try {
      const { data } = await axiosInstance.post(
        "api/admin/config-membership",
        reqData
      );
      enqueueSnackbar(data.message);
      reload();
    } catch (err) {
      if (err.errors) {
        Object.entries(err.errors).forEach(([k, v]) => {
          methods.setError(k, { message: v.find(Boolean) });
        });
      }
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        width: "100%",
        marginTop: 1.5,
        marginBottom: 1.5,
      }}
    >
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <RHFSwitch label="Dynamic Username" name="username_dynamic.status" />
          <RHFSwitch
            label="settings.advanced_settings.membership_packages.show"
            name="age_restriction.status"
          />
          <RHFTextField
            label="settings.advanced_settings.membership_packages.minimum"
            name="age_restriction.value"
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
              <Translate>
                settings.advanced_settings.membership_packages.update
              </Translate>
            </LoadingButton>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
};

export default ConfigSettings;
