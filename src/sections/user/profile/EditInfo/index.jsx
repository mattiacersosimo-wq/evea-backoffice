import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import Countries from "src/components/countries";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";
import Mobile from "./components/Mobile";
import ProfilePicture from "./components/ProfilePicture";
import useUser from "./hooks/useUser";
import HideFromSubAdmin from "src/components/hide-from-subadmin";

const EditInfo = () => {
  const { methods, onSubmit } = useUser();
  const onBlur = ({ target: { value, name } }) =>
    methods.setValue(name, value.trim());
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <ProfilePicture methods={methods} />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
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
              <RHFTextField
                name="username"
                label={"profile.username"}
                onBlur={onBlur}
              />
              <RHFTextField
                name="first_name"
                label={"profile.first_name"}
                onBlur={onBlur}
              />
              <RHFTextField
                name="last_name"
                label={"profile.last_name"}
                onBlur={onBlur}
              />

              <Countries />
              <RHFTextField name="state" label={"profile.state_region"} />
              <RHFTextField name="city" label={"profile.city"} />
              <RHFTextField name="zipcode" label={"profile.zip_codes"} />
              <RHFTextField name="address" label={"profile.address"} />
              <Mobile />

              <RHFTextField
                name="email"
                label={"profile.email_address"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={methods.formState.isSubmitting}
                name="save-changes"
              >
                <Translate>{"profile.save_changes"}</Translate>
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default EditInfo;
// force rebuild Sun Mar 22 20:55:26     2026
