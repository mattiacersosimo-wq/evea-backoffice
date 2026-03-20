import { LoadingButton } from "@mui/lab";
import { Card, Stack, Typography } from "@mui/material";
import Password from "src/components/Password";
import { FormProvider } from "src/components/hook-form";
import Translate from "src/components/translate";
import useUpdatePassword from "./hooks/use-update-password";

const UpdatePassword = () => {
  const { methods, onSubmit } = useUpdatePassword();

  const {
    formState: { isSubmitting },
  } = methods;

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>network_members.change_password</Translate>
      </Typography>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} alignItems="flex-end">
          <Password
            name="password"
            label="profile.settings.password.new_password"
          />
          <Password
            name="confirmNewPassword"
            label="profile.settings.password.confirm"
          />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            name="submit"
          >
            <Translate>profile.settings.password.save</Translate>
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
};

export default UpdatePassword;
