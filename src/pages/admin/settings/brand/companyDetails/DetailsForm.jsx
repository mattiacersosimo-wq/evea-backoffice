import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form"; // form

import { RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

const DetailsForm = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <Stack spacing={3} mt={2} alignItems="flex-end">
        <RHFTextField
          name="name"
          type="text"
          label={"settings.brand.company_name"}
        />
        <RHFTextField
          name="address"
          type="text"
          label={"settings.brand.company_address"}
        />
        <RHFTextField
          fullWidth
          disabled
          placeHolder="johndoe@gmail.com"
          name="email"
          type="text"
          label={"settings.brand.email"}
          InputLabelProps={{ shrink: true }}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          name="save"
        >
          <Translate>{"settings.brand.save"}</Translate>
        </LoadingButton>
      </Stack>
    </>
  );
};
export default DetailsForm;
