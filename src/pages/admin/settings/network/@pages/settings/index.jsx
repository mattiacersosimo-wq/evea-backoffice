import { LoadingButton } from "@mui/lab";
import { Box, InputAdornment } from "@mui/material";
import Iconify from "src/components/Iconify";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import useGetSettings from "./hooks/useGetSettings";
import useUpdateSettings from "./hooks/useUpdateSettings";

const Settings = () => {
  const methods = useGetSettings();
  const onSubmit = useUpdateSettings();
  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: "50%",
          display: "grid",
          gridTemplateColumns: "80% auto",
          columnGap: 2,
        }}
      >
        <RHFTextField
          size="small"
          name="referral_bonus"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="uil:percentage" />
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          loading={methods.formState.isSubmitting}
          variant="contained"
          type="submit"
          name="update"
        >
          Update
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};

export default Settings;
