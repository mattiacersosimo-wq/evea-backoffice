import Ternary from "src/components/ternary";

const TabPanel = ({ name, value, children }) => (
    <Ternary when={name === value} then={children} />
);

export default TabPanel;
