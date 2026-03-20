import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";

export const HideFromHoldingTank = ({ children }) => {
  const { user } = useAuth();
  const { isHoldingTank } = user || {};
  const isNotHoldingTank = isHoldingTank === 0;

  return <Ternary when={isNotHoldingTank} then={children} />;
};
