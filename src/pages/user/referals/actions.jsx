import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

const Actions = ({ openSponsor, status }) => {
  const { t } = useTranslation();
  return (
    <MenuItem onClick={openSponsor} name="sponsor">
      <Iconify icon={"mdi:handshake"} />
      {t("referrals.sponsor")}
    </MenuItem>
  );
};

export default Actions;