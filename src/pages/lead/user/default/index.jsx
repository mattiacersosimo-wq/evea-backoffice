import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import { PATH_USER } from "src/routes/paths";
import useUpdateTemplate from "./hooks/use-update-template";

const DefaultTemplate = () => {
  const { onSubmit, methods } = useUpdateTemplate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Page title="lead_capture.lead">
      <HeaderBreadcrumbs
        heading="lead_capture.lead"
        links={[
          { name: "global.dashboard", href: PATH_USER.user_dashboard },
          { name: "lead_capture.lead", href: PATH_USER.leads.root },
          { name: "lead_capture.edit" },
        ]}
      />

      <Card sx={{ p: 3, width: "60%" }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Headline" name="headline" />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Subheading" name="Subheading" />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField
                label="Features and benefits"
                name="features_and_benefits"
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField
                label="Objection Handling"
                name="objection_handling"
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <RHFTextField label="Social Proof" name="social_proof" />
            </Grid>
            <Grid item md={6} sm={12}>
              <input {...register("visuals")} type="file" />
            </Grid>
          </Grid>

          <Box
            sx={{
              width: "100%",
              textAlign: "end",
              marginTop: 2,
            }}
          >
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
            >
              submit
            </LoadingButton>
          </Box>
        </FormProvider>
      </Card>
    </Page>
  );
};

export default DefaultTemplate;
