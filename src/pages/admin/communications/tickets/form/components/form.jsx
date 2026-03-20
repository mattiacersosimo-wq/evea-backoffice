import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import UsersSearch from "src/components/autoComplete/users";
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Translate from "src/components/translate";

import Category from "src/pages/admin/communications/help-center/ticket/components/form/components/Category";
import Departments from "src/pages/admin/communications/help-center/ticket/components/form/components/Departments";
import Priorities from "src/pages/admin/communications/help-center/ticket/components/form/components/Priorities";

const Form = ({ methods, onSubmit, disableUser, buttonLabel }) => {
  const {
    formState: { isSubmitting },
  } = methods;
  const { t } = useTranslation();
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          display: "grid",
          rowGap: 3,
          columnGap: 2,
          marginTop: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
          },
        }}
      >
        <UsersSearch name="user_id" props={{ disabled: disableUser }} />

        <RHFTextField name="subject" label="help_center.form.subject" />
        <Typography>
          <Translate>help_center.form.description</Translate>
        </Typography>
        <RHFEditor name="description" label="Description" simple />
      </Box>
      <Box
        sx={{
          display: "grid",
          rowGap: 3,
          columnGap: 2,
          marginTop: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          },
        }}
      >
        <Priorities />
        <Departments />
        <Category />
        <RHFSelect
          name="status"
          label="help_center.form.status"
          InputLabelProps={{
            shrink: true,
          }}
        >
          <option value="" />
          <option value="open">{t("help_center.status.open")}</option>
          <option value="resolved">{t("help_center.status.resolved")}</option>
          <option value="closed">{t("help_center.status.closed")}</option>
          <option value="archived">{t("help_center.status.archived")}</option>
          <option value="deleted">{t("help_center.status.deleted")}</option>
          <option value="unverified">
            {t("help_center.status.unverified")}
          </option>
          <option value="request_approval">
            {t("help_center.status.request_approval")}
          </option>
          <option value="in_progress">
            {t("help_center.status.in_progress")}
          </option>
          <option value="responded">{t("help_center.status.responded")}</option>
        </RHFSelect>

        <TextField
          {...methods.register("attachments_url")}
          label={t("help_center.form.document")}
          type="file"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box sx={{ p: 1, textAlign: "right" }}>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          <Translate>{buttonLabel}</Translate>
        </LoadingButton>
      </Box>
    </FormProvider>
  );
};

export default Form;
