import { useSnackbar } from "notistack";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Card, Stack } from "@mui/material";
// components
import { FormProvider, RHFTextField } from "../../../components/hook-form";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

  const defaultValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar("Update success!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField
            name="oldPassword"
            type="password"
            label={"headerSettings.oldPassword"}
          />

          <RHFTextField
            name="newPassword"
            type="password"
            label={"headerSettings.newPassword"}
          />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label={"headerSettings.confirmNewPassword"}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="save-changes"
          >
            {"headerSettings.saveChanges"}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
