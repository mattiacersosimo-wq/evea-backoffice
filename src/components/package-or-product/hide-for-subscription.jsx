import Ternary from "src/components/ternary";
import useIsSubscription from "./hooks/use-is-subscription";

const HideForSubscription = ({ children }) => {
  const isSubscription = useIsSubscription();
  return <Ternary when={!isSubscription} then={children} />;
};

export default HideForSubscription;
