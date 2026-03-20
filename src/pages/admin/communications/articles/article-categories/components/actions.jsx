import { MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const Actions = ({ openEdit, openDelete, permission }) => {
  const { edit, delete: remove } = permission;

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
            <Translate>articles.categories.actions.edit</Translate>
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
            <Translate>articles.categories.actions.delete</Translate>
          </MenuItem>
        }
      />
    </>
  );
};

export default Actions;
