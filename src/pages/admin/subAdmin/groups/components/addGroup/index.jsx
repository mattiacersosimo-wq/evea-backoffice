import Group from "../group";
import useAdd from "./hooks/useAdd";

const AddGroup = ({ open, onClose }) => {
  const { onSubmit, methods } = useAdd(() => {
    onClose();
  });

  return <Group open={open} methods={methods} onSubmit={onSubmit} />;
};

export default AddGroup;
