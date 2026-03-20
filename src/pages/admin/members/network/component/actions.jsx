import { Divider, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import useImpersonate from "src/hooks/useImpersonate";

import { PATH_DASHBOARD } from "src/routes/paths";

const Actions = ({
  isMailVerified,
  isMailTurnedOn,
  openChangePassword,
  openChangeUsername,
  openBlock,
  selectedId,
  isBlocked,
  handleOpenTurnOnMail,
  handleOpenVerify,
}) => {
  const onImpersonate = useImpersonate(selectedId);
  const { t } = useTranslation();
  return (
    <>
      <MenuItem
        sx={{ color: "default.main" }}
        onClick={openChangePassword}
        name="password"
      >
        <Iconify icon={"ri:lock-password-line"} />
        <Translate>{"network_members.password"}</Translate>
      </MenuItem>
      {/* <MenuItem
        sx={{ color: "default.main" }}
        onClick={openChangeUsername}
        name="username"
      >
        <Iconify icon={"bxs:user-account"} />
        <Translate> {"network_members.username"}</Translate>
      </MenuItem> */}
      <MenuItem
        onClick={onImpersonate}
        sx={{ color: "default.main" }}
        name="impersonate"
      >
        <Iconify icon={"ant-design:user-switch-outlined"} />
        <Translate> {"network_members.impersonate"}</Translate>
      </MenuItem>
      <MenuItem
        component={Link}
        to={`${PATH_DASHBOARD.members.member_profile}/${selectedId}`}
        sx={{ color: "default.main" }}
        name="profile"
      >
        <Iconify icon={"ant-design:user-outlined"} />
        <Translate> {"network_members.profile"}</Translate>
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (isMailVerified) return;
          handleOpenVerify();
        }}
        sx={{ color: "default.main" }}
        name="verified"
      >
        <Iconify icon={"fluent:mail-16-regular"} />
        {isMailVerified
          ? t("network_members.verified")
          : t("network_members.verify")}
      </MenuItem>
      <MenuItem
        onClick={handleOpenTurnOnMail}
        sx={{ color: "default.main" }}
        name="notification"
      >
        <Iconify icon={"carbon:notification-off"} />
        {isMailTurnedOn
          ? t("network_members.turn_off_email")
          : t("network_members.turn_on_email")}
      </MenuItem>

      <Divider />
      <MenuItem sx={{ color: "warning.main" }} onClick={openBlock} name="block">
        <Iconify icon={"ic:outline-block"} />
        {t("network_members.permissions")}
      </MenuItem>
    </>
  );
};

export default Actions;
