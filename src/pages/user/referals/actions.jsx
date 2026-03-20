import { MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";

const Actions = ({ openSponsor, status }) => {
  return (
    <MenuItem onClick={openSponsor} name="sponsor">
      <Iconify icon={"mdi:handshake"} />
      <Translate>Sponsor</Translate>
    </MenuItem>
  );
};

export default Actions;