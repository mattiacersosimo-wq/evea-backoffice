import { usePlan } from "src/store/plan";
import Ternary from "../ternary";

const ShowForPlan = ({ children, types = [] }) => {
    const plan = usePlan();

    return (
        <Ternary
            when={types.indexOf(plan) > -1 || types.length === 0}
            then={children}
        />
    );
};

export default ShowForPlan;
