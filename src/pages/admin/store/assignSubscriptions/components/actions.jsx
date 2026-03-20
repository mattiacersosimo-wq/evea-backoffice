import { Divider, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useImpersonate from "src/hooks/useImpersonate";

import { PATH_DASHBOARD } from "src/routes/paths";

const Actions = ({ openDelete, openEdit, userId, openBlock, status }) => {
  const onImpersonate = useImpersonate(userId);

  const { edit, remove } = status;

  return (
    <>
      <MenuItem
        sx={{ color: "default.main" }}
        onClick={onImpersonate}
        name="impersonate"
      >
        <Iconify icon={"ant-design:user-switch-outlined"} />
        <Translate> {"assign_subscriptions.impersonate"}</Translate>
      </MenuItem>
      <MenuItem
        sx={{ color: "default.main" }}
        component={Link}
        to={`${PATH_DASHBOARD.members.member_profile}/${userId}`}
        name="profile"
      >
        <Iconify icon={"ant-design:user-outlined"} />
        <Translate> {"assign_subscriptions.profile"}</Translate>
      </MenuItem>

      <Ternary
        when={edit}
        then={
          <MenuItem
            sx={{ color: "default.main" }}
            onClick={openEdit}
            name="edit"
          >
            <Iconify icon={"akar-icons:edit"} />
            <Translate> {"assign_subscriptions.edit"}</Translate>
          </MenuItem>
        }
      />

      <MenuItem
        sx={{ color: "default.main" }}
        onClick={() => {
          alert("Email");
        }}
        name="email"
      >
        <Iconify icon={"fluent:mail-16-regular"} />
        <Translate> {"assign_subscriptions.email"}</Translate>
      </MenuItem>
      <MenuItem
        onClick={openBlock}
        sx={{
          color: "warning.main",
        }}
        name="block"
      >
        <Iconify icon={"bx:block"} />
        <Translate> {"assign_subscriptions.permissions"}</Translate>
      </MenuItem>

      <Ternary
        when={remove}
        then={
          <>
            <Divider />
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={openDelete}
              name="delete"
            >
              <Iconify icon={"eva:trash-2-outline"} />
              <Translate> {"assign_subscriptions.delete"}</Translate>
            </MenuItem>
          </>
        }
      />
    </>
  );
};

export default Actions;
