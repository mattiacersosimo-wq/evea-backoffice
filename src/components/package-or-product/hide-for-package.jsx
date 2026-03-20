import Ternary from "src/components/ternary";
import useIsPackage from "./hooks/use-is-package";

const HideForPackage = ({ children }) => {
  const isPackage = useIsPackage();
  return <Ternary when={!isPackage} then={children} />;
};

export default HideForPackage;
