import { useReducer } from "react";
import { PLAN_NAME } from "src/config";
import { PlanDataContext, PlanDispatchContext } from "./plan-context";
import planReducer from "./reducer";

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(planReducer, null, () => {
    if (PLAN_NAME) return PLAN_NAME;
    const chosenPlan = localStorage.getItem("plan");
    if (chosenPlan) return chosenPlan;
    return null;
  });

  return (
    <PlanDataContext.Provider value={state}>
      <PlanDispatchContext.Provider value={dispatch}>
        {children}
      </PlanDispatchContext.Provider>
    </PlanDataContext.Provider>
  );
};

export default Provider;
