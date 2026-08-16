import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, MenuItem, Stack, Typography, Alert } from "@mui/material";
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
  const { methods, onSubmit } = useCreateTemplate();
  const {
    formState: { isSubmitting },
  } = methods;
  const [showHtmlSource, setShowHtmlSource] = useState(true); // Default source: incolla HTML

  return (
    <Page title="Nuova Email">
      <Box>
        <HeaderBreadcrumbs
          heading="Nuova Email"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Email", href: PATH_DASHBOARD.settings.email_settings.root },
            { name: "Nuova" },
          ]}
        />

        <Alert severity="info" sx={{ mb: 2 }}>
          Crea un nuovo template email. La <b>chiave</b> è l'identificativo univoco (es. <code>client_welcome_special</code>) che il backend usa per triggerare l'invio. Deve essere univoca per lingua.
        </Alert>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <RHFTextField
                label="Chiave (email key)"
                name="email"
                placeholder="es. client_welcome_special"
                required
              />
            </Grid>
            <Grid item md={3}>
              <RHFSelect name="language" label="Lingua" required>
                <MenuItem value="it">Italiano (it)</MenuItem>
                <MenuItem value="en">English (en)</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item md={3}>
              <RHFTextField
                label="SendGrid Template ID (opzionale)"
                name="email_template_id"
              />
            </Grid>
            <Grid item md={12}>
              <RHFTextField
                label="Oggetto (subject)"
                name="subject"
                placeholder="es. eVea — Il tuo nuovo template"
                required
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Placeholder disponibili nel contenuto:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="caption">
                  <code>[nome]</code>: nome utente destinatario
                </Typography>
                <Typography variant="caption">
                  <code>[email]</code>: email destinatario
                </Typography>
                <Typography variant="caption">
                  <code>[year]</code>: anno corrente
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                  {showHtmlSource ? "HTML source (incolla raw HTML)" : "Editor visuale"}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon={showHtmlSource ? "material-symbols:visibility-outline" : "material-symbols:code"} />}
                  onClick={() => setShowHtmlSource(!showHtmlSource)}
                  sx={{ color: "#B8963B", borderColor: "#B8963B" }}
                >
                  {showHtmlSource ? "Editor visuale" : "Modifica HTML"}
                </Button>
              </Stack>
              {showHtmlSource ? (
                <RHFTextField
                  name="content"
                  multiline
                  minRows={20}
                  maxRows={40}
                  placeholder="Incolla qui HTML del template..."
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
                  label="Contenuto"
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
                Crea Template
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Page>
  );
};

export default NewTemplate;
