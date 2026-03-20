import { MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import TableMenu from "src/components/tableMenu";
import Translate from "src/components/translate";

const Actions = ({ onClose, open, openEdit, handleOpenDelete }) => {
  return (
    <TableMenu onClose={onClose} open={open}>
      <MenuItem sx={{ color: "default.main" }} name="edit" onClick={openEdit}>
        <Iconify icon={"akar-icons:edit"} />
        <Translate>articles.categories.actions.edit</Translate>
      </MenuItem>
      <MenuItem
        sx={{ color: "error.main" }}
        name="delete"
        onClick={handleOpenDelete}
      >
        <Iconify icon={"eva:trash-2-outline"} />
        <Translate>articles.categories.actions.delete</Translate>
      </MenuItem>
    </TableMenu>
  );
};

export default Actions;
