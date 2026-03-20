import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_USER } from "src/routes/paths";

const CloseDialog = ({ onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(PATH_USER.onlineStore.productSubscription.root);
    }
  };

  return (
    <IconButton onClick={handleClose}>
      <Iconify icon="material-symbols:close" />
    </IconButton>
  );
};
export default CloseDialog;
