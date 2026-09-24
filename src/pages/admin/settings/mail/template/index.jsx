import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
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
  const { t } = useTranslation();
  const { methods, onSubmit } = useUpdateTemplate();
  const {
    formState: { isSubmitting },
    watch,
  } = methods;
  // Default HTML source: le mail eVea hanno tabelle inline styles che
  // il WYSIWYG stripperebbe. Meglio partire in source safe.
  const [showHtmlSource, setShowHtmlSource] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showWysiwygWarning, setShowWysiwygWarning] = useState(false);

  const { queryObject } = useQueryParams();
  const { name } = queryObject;

  const contentValue = watch("content") || "";

  const handleToggleEditor = () => {
    if (showHtmlSource) {
      // Passando da HTML source → WYSIWYG: mostra warning
      setShowWysiwygWarning(true);
    } else {
      setShowHtmlSource(true);
    }
  };

  const confirmSwitchToWysiwyg = () => {
    setShowHtmlSource(false);
    setShowWysiwygWarning(false);
  };

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
          action={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="material-symbols:preview" />}
              onClick={() => setShowPreview(true)}
              sx={{ color: "#B8963B", borderColor: "#B8963B" }}
            >
              {t("admin.mail.btn_preview", "Anteprima")}
            </Button>
          }
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <RHFTextField label="email_template.form.subject" name="subject" />
            </Grid>
            <Grid item md={6}>
              <RHFTextField
                label="email_template.form.email_template_id"
                name="email_template_id"
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="subtitle1">{t("admin.mail.placeholders_available", "Placeholder disponibili:")}</Typography>
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  {showHtmlSource ? t("admin.mail.html_source_safe", "HTML source (safe per email complesse)") : t("admin.mail.visual_editor_dangerous", "Editor visuale (pericoloso su tabelle inline)")}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon={showHtmlSource ? "material-symbols:visibility-outline" : "material-symbols:code"} />}
                  onClick={handleToggleEditor}
                  sx={{ color: "#B8963B", borderColor: "#B8963B" }}
                >
                  {showHtmlSource ? t("admin.mail.visual_editor", "Editor visuale") : t("admin.mail.back_to_html", "Torna a HTML")}
                </Button>
              </Stack>
              {showHtmlSource ? (
                <RHFTextField
                  name="content"
                  multiline
                  minRows={20}
                  maxRows={40}
                  placeholder={t("admin.mail.html_raw_placeholder", "HTML raw...")}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      lineHeight: 1.5,
                    },
                  }}
                />
              ) : (
                <>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    {t("admin.mail.wysiwyg_warning_inline", "Attenzione: l'editor visuale può strippare tabelle inline styles. Se il template è complesso (email marketing con tabelle nested), usa HTML source.")}
                  </Alert>
                  <RHFEditor
                    label="email_template.form.content"
                    name="content"
                    sx={{ height: "500px" }}
                  />
                </>
              )}
            </Grid>
            <Grid item md={12} textAlign="right">
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                <Translate>email_template.form.button</Translate>
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>

      {/* Modal preview iframe: rendering fedele HTML come lo vedrà il destinatario */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <span>{t("admin.mail.preview_email", "Anteprima email")}</span>
            <IconButton onClick={() => setShowPreview(false)}>
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <iframe
            title={t("admin.mail.preview_email", "Anteprima email")}
            srcDoc={contentValue}
            style={{ width: "100%", height: "70vh", border: "1px solid #e0e0e0", borderRadius: 4 }}
            sandbox=""
          />
        </DialogContent>
      </Dialog>

      {/* Modal warning switch a WYSIWYG */}
      <Dialog open={showWysiwygWarning} onClose={() => setShowWysiwygWarning(false)} maxWidth="sm">
        <DialogTitle>{t("admin.mail.warning_title", "Attenzione")}</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {t("admin.mail.wysiwyg_warning_destroy", "L'editor visuale può distruggere template HTML complessi (tabelle nested, inline styles). Le mail eVea usano tabelle con stili inline per essere compatibili con Outlook/Gmail — l'editor visuale li strippa.")}
          </Alert>
          <Typography variant="body2">
            {t("admin.mail.wysiwyg_warning_advice", "Se il template è semplice (testo + link) puoi usare il visuale in sicurezza. Se è un template email con tabelle nested (welcome, T3, T4, C-APP, ecc.) NON salvare in modalità visuale o distruggerai il rendering.")}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={() => setShowWysiwygWarning(false)}>{t("common.cancel", "Annulla")}</Button>
            <Button onClick={confirmSwitchToWysiwyg} color="warning" variant="contained">
              {t("admin.mail.switch_to_visual", "Passa a visuale")}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default Template;
