import { Navigate } from "react-router";
import { usePlan } from "src/store/plan";
import Ternary from "../ternary";

const PlanConfirm = ({ children, types = [] }) => {
    const plan = usePlan();
    return (
        <Ternary
            when={types.indexOf(plan) > -1 || types.length === 0}
            then={children}
            otherwise={<Navigate to="404" replace />}
        />
    );
};

export default PlanConfirm;
