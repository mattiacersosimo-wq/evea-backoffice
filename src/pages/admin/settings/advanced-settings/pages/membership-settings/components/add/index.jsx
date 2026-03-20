import FormDialog from "../form-dialog";
import useAdd from "./hooks/use-add";

const Add = ({ open, onClose, reload }) => {
  const update = useAdd(() => {
    reload();
    onClose();
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      update={update}
      buttonLabel="create"
      title="Add Field"
    />
  );
};

export default Add;
