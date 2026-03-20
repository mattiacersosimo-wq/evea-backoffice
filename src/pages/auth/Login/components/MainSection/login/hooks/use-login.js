import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
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

  const { setError, handleSubmit, setValue } = methods;

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

  const onSubmit = async (inputData) => {
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
      setError("afterSubmit", {
        message,
      });
    }
  };

  return { onSubmit: handleSubmit(onSubmit), methods };
};

export default useLogin;
