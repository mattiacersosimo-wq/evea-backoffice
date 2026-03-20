import { useMemo } from "react";
import Ternary from "src/components/ternary";
import useAvailableUserPayouts from "src/pages/user/financial/requestPayout/components/available-payouts/hooks/use-available-payout";

const HidePayout = ({ children, payoutId }) => {
  const payouts = useAvailableUserPayouts();

  const show = useMemo(() => {
    if (payouts.length > 0) {
      return payouts.findIndex(({ id }) => id === payoutId) > -1;
    }

    return false;
  }, [payouts.length]);

  return <Ternary when={show} then={children} />;
};

export default HidePayout;
