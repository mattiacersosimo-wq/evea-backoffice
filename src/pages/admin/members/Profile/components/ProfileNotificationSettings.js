import { LoadingButton } from "@mui/lab";
import { Card, FormControl, FormGroup, Stack, Typography } from "@mui/material";

import { FormProvider, RHFSwitch } from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useUpdateProfileNotification from "../hooks/useUpdateProfileNotification";

const ProfileNotificationSettings = () => {
  const { methods, onSubmit } = useUpdateProfileNotification();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { t } = useTranslation();
  return (
    <div>
      <Card sx={{ p: 3, mt: 1 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {/* <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
            <Translate> {"profile.twoStep"}</Translate>
          </Typography>
          <RHFSwitch name="twofa" label={"profile.twoStepAuthentication"} /> */}
          <Stack spacing={3} alignItems="flex-end">
            <Stack spacing={2} sx={{ width: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.primary"
                mt={2}
                mb={2}
              >
                <Translate> {"profile.emailNotificationSettings"}</Translate>
              </Typography>

              <Stack spacing={1}>
                <FormControl component="fieldset" variant="standard">
                  <FormGroup>
                    <RHFSwitch name="1" label={t("profile.materialAdd")} />
                    <RHFSwitch name="2" label={t("profile.productBusiness")} />
                    <RHFSwitch name="3" label={t("profile.blog")} />
                    <RHFSwitch name="4" label={t("profile.rankachieved")} />
                    <RHFSwitch name="5" label={t("profile.paymentCompleted")} />
                    <RHFSwitch name="6" label={t("profile.newUserAdded")} />
                    <RHFSwitch name="7" label={t("profile.accountUpdate")} />
                    <RHFSwitch
                      name="8"
                      label={t("profile.friendRegisterMail")}
                    />
                    <RHFSwitch
                      name="9"
                      label={t("profile.telegramInstructionMails")}
                    />
                    <RHFSwitch name="10" label={t("profile.mailsFromAdmin")} />
                  </FormGroup>
                </FormControl>
              </Stack>
            </Stack>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              name="notification-settings"
            >
              <Translate>{"profile.save_changes"}</Translate>
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </div>
  );
};

export default ProfileNotificationSettings;
