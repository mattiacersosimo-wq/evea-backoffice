import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useRegister from "./hooks/use-register";

const Form = () => {
  const { methods, onSubmit } = useRegister();
  const { handleSubmit } = methods;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <RHFTextField label="Name" name="name" />
        <RHFTextField label="Email" name="email" />
        <RHFTextField label="Mobile" name="mobile" />
        <LoadingButton type="submit" fullWidth variant="contained">
          <Translate>lead_capture.submit</Translate>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export default Form;
