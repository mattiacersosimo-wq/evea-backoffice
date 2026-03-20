import FormDialog from "../form-dialog";
import useUpdate from "./hooks/use-update";

const Edit = ({ id, onClose, reload }) => {
  const update = useUpdate(id, () => {
    reload();
    onClose();
  });

  return (
    <FormDialog
      open={Boolean(id)}
      onClose={onClose}
      update={update}
      buttonLabel="update"
      title="Edit Field"
    />
  );
};

export default Edit;
