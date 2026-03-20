import Ternary from "src/components/ternary";
import useIsPackage from "./hooks/use-is-package";

const ShowForPackage = ({ children }) => {
  const isPackage = useIsPackage();

  return <Ternary when={isPackage} then={children} />;
};

export default ShowForPackage;
