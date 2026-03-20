import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "src/hooks/useAuth";

const defaultValues = {
  twofa: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
  9: false,
  10: false,
};

const useProfileNotificationSettingsForm = () => {
  const { user } = useAuth();

  const methods = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      const { email_notification_settings, "2fa": TFA } = user || {};
      if (email_notification_settings) {
        Object.keys(email_notification_settings).forEach((key) =>
          methods.setValue(key, true)
        );
        methods.setValue("twofa", Boolean(TFA));
      }
    }
  }, [user]);

  return methods;
};

export default useProfileNotificationSettingsForm;
