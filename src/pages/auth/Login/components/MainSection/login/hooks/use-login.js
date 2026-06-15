import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PLANS } from "src/CONSTANTS";
import useAuth from "src/hooks/useAuth";
import useQueryParams from "src/hooks/useQueryParams";
import useGetCurrency from "src/layouts/shared/header/components/currency-popover/hooks/use-get-currency";
import { usePlan } from "src/store/plan";
import * as Yup from "yup";
import useSetPlan from "./use-set-plan";
import { useTranslation } from "react-i18next";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("errors.login.email.email")
    .required("errors.login.email.required"),
  password: Yup.string().required("errors.login.password.required"),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
  plan: null,
  secret: null,
};

const useLogin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const fetchCurrency = useGetCurrency();
  const { login } = useAuth();
  const plan = usePlan();

  const { queryObject } = useQueryParams();
  const { plan: selectedPlan } = queryObject;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (selectedPlan) {
      const currentPlan = PLANS[selectedPlan];
      if (currentPlan) setValue("plan", currentPlan);
      else setValue("plan", PLANS.binary);
    } else {
      setValue("plan", plan ? plan : PLANS.binary);
    }
  }, [plan, selectedPlan]);

  const setPlan = useSetPlan();
  const { t } = useTranslation();

  // I messaggi di errore del login arrivano grezzi dal backend, spesso in
  // inglese (es. "Wrong credentials!" quando lo sponsor/utente non e'
  // autenticato e translateResponse non sa la lingua). Qui li localizziamo.
  const localizeAuthError = (message) => {
    const map = {
      "Wrong credentials!": [
        "errors.login.invalid_credentials",
        "Email o password non corretti.",
      ],
      "User is blocked!": [
        "errors.login.blocked",
        "Il tuo account e' bloccato. Contatta il supporto.",
      ],
      "Access Denied.": ["errors.login.access_denied", "Accesso negato."],
      "Admin cant login !": [
        "errors.login.admin_cant_login",
        "Accesso negato.",
      ],
      "Please login after verifying email!": [
        "errors.login.verify_email",
        "Verifica la tua email prima di accedere.",
      ],
      "Unable to reach the login server.": [
        "errors.login.server_unreachable",
        "Impossibile contattare il server. Riprova piu' tardi.",
      ],
    };
    const entry = map[message];
    if (entry) return t(entry[0], entry[1]);
    return message || t("errors.login.generic", "Accesso non riuscito. Riprova.");
  };

  const onSubmit = async (inputData) => {
    setAuthError("");
    const { status, data, message, secret, isAdmin, isSubAdmin } = await login(
      inputData
    );

    if (status) {
      setPlan(inputData.plan);
      enqueueSnackbar(`${t("register.welcome_back")} ${data}`);
      fetchCurrency(isAdmin || isSubAdmin);
    } else if (secret) {
      setValue("secret", secret);
    } else {
      setAuthError(localizeAuthError(message));
    }
  };

  return { onSubmit: handleSubmit(onSubmit), methods, authError };
};

export default useLogin;
