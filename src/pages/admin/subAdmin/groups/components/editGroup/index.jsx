import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import Group from "../group";
import useEdit from "./hooks/useEdit";

const EditGroup = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { onSubmit, methods } = useEdit(() => {
    onClose();
    navigate(PATH_DASHBOARD.subAdmin.add_user_group);
  });
  return <Group open={open} methods={methods} onSubmit={onSubmit} />;
};

export default EditGroup;
