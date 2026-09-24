import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, MenuItem, Stack, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { PATH_DASHBOARD } from "src/routes/paths";
import useCreateTemplate from "./hooks/use-create-template";

const NewTemplate = () => {
  const { t } = useTranslation();
  const { methods, onSubmit } = useCreateTemplate();
  const {
    formState: { isSubmitting },
  } = methods;
  const [showHtmlSource, setShowHtmlSource] = useState(true); // Default source: incolla HTML

  return (
    <Page title={t("admin.mail.new_page_title", "Nuova Email")}>
      <Box>
        <HeaderBreadcrumbs
          heading={t("admin.mail.new_page_title", "Nuova Email")}
          links={[
            { name: t("admin.mail.crumb_dashboard", "Dashboard"), href: PATH_DASHBOARD.root },
            { name: t("admin.mail.crumb_email", "Email"), href: PATH_DASHBOARD.settings.email_settings.root },
            { name: t("admin.mail.crumb_new", "Nuova") },
          ]}
        />

        <Alert severity="info" sx={{ mb: 2 }}>
          {t("admin.mail.new_alert", "Crea un nuovo template email. La chiave è l'identificativo univoco (es. client_welcome_special) che il backend usa per triggerare l'invio. Deve essere univoca per lingua.")}
        </Alert>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <RHFTextField
                label={t("admin.mail.field_key", "Chiave (email key)")}
                name="email"
                placeholder={t("admin.mail.field_key_placeholder", "es. client_welcome_special")}
                required
              />
            </Grid>
            <Grid item md={3}>
              <RHFSelect name="language" label={t("admin.mail.field_language", "Lingua")} required>
                <MenuItem value="it">{t("admin.mail.lang_it", "Italiano (it)")}</MenuItem>
                <MenuItem value="en">{t("admin.mail.lang_en", "English (en)")}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item md={3}>
              <RHFTextField
                label={t("admin.mail.field_sendgrid_id", "SendGrid Template ID (opzionale)")}
                name="email_template_id"
              />
            </Grid>
            <Grid item md={12}>
              <RHFTextField
                label={t("admin.mail.field_subject", "Oggetto (subject)")}
                name="subject"
                placeholder={t("admin.mail.field_subject_placeholder", "es. eVea — Il tuo nuovo template")}
                required
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("admin.mail.placeholders_title", "Placeholder disponibili nel contenuto:")}
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption">
                  <code>[nome]</code>: {t("admin.mail.ph_name", "nome utente destinatario")}
                </Typography>
                <Typography variant="caption">
                  <code>[email]</code>: {t("admin.mail.ph_email", "email destinatario")}
                </Typography>
                <Typography variant="caption">
                  <code>[year]</code>: {t("admin.mail.ph_year", "anno corrente")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  {showHtmlSource ? t("admin.mail.html_source_label", "HTML source (incolla raw HTML)") : t("admin.mail.visual_editor", "Editor visuale")}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon={showHtmlSource ? "material-symbols:visibility-outline" : "material-symbols:code"} />}
                  onClick={() => setShowHtmlSource(!showHtmlSource)}
                  sx={{ color: "#B8963B", borderColor: "#B8963B" }}
                >
                  {showHtmlSource ? t("admin.mail.visual_editor", "Editor visuale") : t("admin.mail.edit_html", "Modifica HTML")}
                </Button>
              </Stack>
              {showHtmlSource ? (
                <RHFTextField
                  name="content"
                  multiline
                  minRows={20}
                  maxRows={40}
                  placeholder={t("admin.mail.html_placeholder", "Incolla qui HTML del template...")}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      lineHeight: 1.5,
                    },
                  }}
                />
              ) : (
                <RHFEditor
                  label={t("admin.mail.field_content", "Contenuto")}
                  name="content"
                  sx={{ height: "500px" }}
                />
              )}
            </Grid>
            <Grid item md={12} textAlign="right">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                sx={{ background: "#B8963B", "&:hover": { background: "#a08333" } }}
              >
                {t("admin.mail.btn_create_template", "Crea Template")}
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Page>
  );
};

export default NewTemplate;
