import { MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { PATH_DASHBOARD } from "src/routes/paths";

const Actions = ({ status, openDelete, selectedId, isDraft, openPublish }) => {
  const editPath = PATH_DASHBOARD.communication.editBlog(selectedId);

  return (
    <>
      <Ternary
        when={status.edit}
        then={
          <MenuItem
            component={Link}
            to={editPath}
            sx={{ color: "default.main" }}
            name="edit"
          >
            <Iconify icon={"akar-icons:edit"} />
            <Translate>actions.edit</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={status.publish && isDraft}
        then={
          <>
            <MenuItem
              onClick={openPublish}
              sx={{ color: "success.main" }}
              name="publish"
            >
              <Iconify icon="material-symbols:publish" />
              <Translate>actions.publish</Translate>
            </MenuItem>
          </>
        }
      />

      <Ternary
        when={status.delete}
        then={
          <>
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={openDelete}
              name="delete"
            >
              <Iconify icon={"eva:trash-2-outline"} />
              <Translate>actions.delete</Translate>
            </MenuItem>
          </>
        }
      />
    </>
  );
};

export default Actions;
