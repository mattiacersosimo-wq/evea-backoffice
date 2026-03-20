import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { PLANS } from "src/CONSTANTS";
import useAuth from "src/hooks/useAuth";
import useQueryParams from "src/hooks/useQueryParams";
import { usePlan } from "src/store/plan";
import useRegisterForm from "./use-register-form";

const useRegister = () => {
  const methods = useRegisterForm();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { setError, setValue } = methods;

  const onSubmit = async (inputData) => {
    try {
      await register(inputData);
      enqueueSnackbar("Your account has been successfully registered!", {
        variant: "success",
      });
    } catch (error) {
      Object.entries(error.errors).forEach(([k, v]) =>
        setError(k, { message: v[0] })
      );
      //       setError("afterSubmit", {
      //         message: error.message.toString(),
      //       });
    }
  };

  const { uname } = useParams();
  useMemo(() => {
    if (uname) {
      setValue("referral", uname);
    }
  }, [uname]);

  const plan = usePlan();

  const { queryObject } = useQueryParams();
  const { plan: selectedPlan } = queryObject;
  useEffect(() => {
    if (selectedPlan) {
      const currentPlan = PLANS[selectedPlan];
      if (currentPlan) setValue("plan", currentPlan);
      else setValue("plan", PLANS.binary);
    } else {
      setValue("plan", plan ? plan : PLANS.binary);
    }
  }, [plan, selectedPlan]);

  return { methods, onSubmit };
};

export default useRegister;
