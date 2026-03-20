import { MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useImpersonate from "src/hooks/useImpersonate";

import { PATH_DASHBOARD } from "src/routes/paths";

const Actions = ({ openDelete, id, userId, status, permission }) => {
  const onImpersonate = useImpersonate(userId);
  return (
    <>
      <Ternary
        when={permission.view}
        then={
          <MenuItem
            component={Link}
            to={PATH_DASHBOARD.communication.viewTickets(id)}
            sx={{ color: "default.main" }}
            state={{ status: status }}
            name="view"
          >
            <Iconify icon={"carbon:view"} />
            <Translate>help_center.actions.view</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={permission.impersonate}
        then={
          <MenuItem
            onClick={onImpersonate}
            sx={{ color: "default.main" }}
            name="impersonate"
          >
            <Iconify icon={"ant-design:user-switch-outlined"} />
            <Translate>help_center.actions.impersonate</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={permission.edit}
        then={
          <MenuItem
            to={PATH_DASHBOARD.communication.edit(id)}
            component={Link}
            sx={{ color: "default.main" }}
            name="edit"
          >
            <Iconify icon={"akar-icons:edit"} />
            <Translate>help_center.actions.edit</Translate>
          </MenuItem>
        }
      />

      <Ternary
        when={permission.delete}
        then={
          <MenuItem
            onClick={openDelete}
            sx={{ color: "error.main" }}
            name="delete"
          >
            <Iconify icon={"eva:trash-2-outline"} />
            <Translate>help_center.actions.delete</Translate>
          </MenuItem>
        }
      />
    </>
  );
};

export default Actions;
