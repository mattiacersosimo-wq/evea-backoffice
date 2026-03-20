import { IconButton } from "@mui/material";
import Iconify from "src/components/Iconify";

const AddNew = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <Iconify icon="fluent:add-12-regular" />
    </IconButton>
  );
};
export default AddNew;
