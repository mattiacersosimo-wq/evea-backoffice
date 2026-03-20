import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Countries from "src/components/countries";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Translate from "src/components/translate";
import useUpdateStripe from "./hooks/use-update-stripe";

const Stripe = () => {
  const { methods, onSubmit } = useUpdateStripe();

  const { t } = useTranslation();
  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>profile.settings.stripe.title</Translate>
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.first_name"
              name="first_name"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.last_name"
              name="last_name"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.currency"
              name="currency"
              disabled
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.account_holder_name"
              name="account_holder_name"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.account_holder_type"
              name="account_holder_type"
              disabled
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.routing_number"
              name="routing_number"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.account_number"
              name="account_number"
            />
          </Grid>
          <Grid item md={6}>
            <Countries type="alpha_2" disabled />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.id_number"
              name="id_number"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.phone"
              name="phone"
            />
          </Grid>
          <Grid item md={6}>
            <RHFSelect
              name="gender"
              label="profile.settings.stripe.form.gender"
            >
              <option value="" />
              <option value="male">{t("genders.male")}</option>
              <option value="female">{t("genders.female")}</option>
              <option value="other">{t("genders.other")}</option>
            </RHFSelect>
          </Grid>
          <Grid item md={6}>
            <RHFDatePicker
              label="profile.settings.stripe.form.dob"
              name="date_of_birth"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.line1"
              name="line1"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.line2"
              name="line2"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.city"
              name="city"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.state"
              name="state"
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              label="profile.settings.stripe.form.postal_code"
              name="postal_code"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <LoadingButton
            loading={methods.formState.isSubmitting}
            type="submit"
            variant="contained"
          >
            update
          </LoadingButton>
        </Box>
      </FormProvider>
    </Card>
  );
};

export default Stripe;
