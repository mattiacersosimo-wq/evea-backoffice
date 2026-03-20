import Ternary from "src/components/ternary";

const HideFromForm = ({ data, children }) => {
  return <Ternary when={data} then={children} />;
};

export default HideFromForm;
