import Ternary from "src/components/ternary";
import { usePlan } from "src/store/plan";

const Option = ({ value, label, plans }) => {
  const plan = usePlan();

  const canShow = plans?.includes(plan) || !plans;

  return (
    <Ternary when={canShow} then={<option value={value}>{label}</option>} />
  );
};

export default Option;
