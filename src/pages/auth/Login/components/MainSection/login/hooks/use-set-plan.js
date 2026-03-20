import { PLAN_NAME } from "src/config";
import { loadPlan, usePlanDispatch } from "src/store/plan";

const useSetPlan = () => {
  const dispatch = usePlanDispatch();

  return (plan) => {
    if (!PLAN_NAME) {
      dispatch(loadPlan(plan));
      localStorage.setItem("plan", plan);
    }
  };
};

export default useSetPlan;
