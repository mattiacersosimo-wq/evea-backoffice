import { useContext } from "react";
import { PlanDataContext, PlanDispatchContext } from "./plan-context";

export const useData = () => useContext(PlanDataContext);
export const useDispatch = () => useContext(PlanDispatchContext);
