import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_DASHBOARD } from "src/routes/paths";
import useUpdateTemplate from "./hooks/use-update-template";

const Template = () => {
  const { methods, onSubmit } = useUpdateTemplate();
  const {
    formState: { isSubmitting },
  } = methods;

  const { queryObject } = useQueryParams();
  const { name } = queryObject;

  return (
    <Page title="email_template.title">
      <Box>
        <HeaderBreadcrumbs
          heading="email_template.title"
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            {
              name: "email_template.title",
              href: PATH_DASHBOARD.settings.email_settings.root,
            },
            {
              name: capitalCase(name || ""),
            },
          ]}
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <RHFTextField
                label="email_template.form.subject"
                name="subject"
              />
            </Grid>
            <Grid item md={6}>
              <RHFTextField
                label="email_template.form.email_template_id"
                name="email_template_id"
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="subtitle1">
                Variables available to use:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption">
                  username: Replaced with the target users username
                </Typography>
                <Typography variant="caption">
                  companyName: Replaced with company name{" "}
                </Typography>
                <Typography variant="caption">
                  productName: Replaced with the name of the purchased product
                </Typography>
              </Stack>

              <Typography variant="caption">
                To use the variables use the variables in the format
                [variable_name]
              </Typography>
            </Grid>
            <Grid item md={12}>
              <RHFEditor
                label="email_template.form.content"
                name="content"
                sx={{
                  height: "500px",
                }}
              />
            </Grid>
            <Grid item md={12} textAlign="right">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                <Translate>email_template.form.button</Translate>
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Page>
  );
};

export default Template;
