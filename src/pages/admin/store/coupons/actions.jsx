import { MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const Actions = ({ openEdit, openDelete, status }) => {
  const { remove, edit } = status;

  return (
    <>
      <Ternary
        when={edit}
        then={
          <MenuItem
            sx={{ color: "default.main" }}
            onClick={openEdit}
            name="edit"
          >
            <Iconify icon={"akar-icons:edit"} />
            <Translate>coupons.edit</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={remove}
        then={
          <MenuItem
            sx={{ color: "error.main" }}
            onClick={openDelete}
            name="delete"
          >
            <Iconify icon={"eva:trash-2-outline"} />
            <Translate>coupons.delete</Translate>
          </MenuItem>
        }
      />
    </>
  );
};

export default Actions;
