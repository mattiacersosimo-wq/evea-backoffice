import { Divider, MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Translate from "./translate";

const Actions = ({ openEdit, openDelete }) => {
  return (
    <>
      <MenuItem sx={{ color: "default.main" }} onClick={openEdit} name="edit">
        <Iconify icon={"akar-icons:edit"} />
        <Translate> {"settings.brand.edit"}</Translate>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ color: "error.main" }} onClick={openDelete} name="delete">
        <Iconify icon={"eva:trash-2-outline"} />
        <Translate>{"settings.brand.delete"}</Translate>
      </MenuItem>
    </>
  );
};

export default Actions;
