import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { NavLink as RouterLink } from "react-router-dom";

import Iconify from "src/components/Iconify";

const MenuLinks = ({ linkList = [] }) => {
  const { t } = useTranslation();
  return linkList.map(({ icon, primary, to, name }) => (
    <ListItem disablePadding>
      <ListItemButton to={to} component={RouterLink} name={name}>
        <ListItemIcon>
          <Iconify icon={icon.icon} style={{ color: icon.color }} />
        </ListItemIcon>
        <ListItemText primary={t(primary)} />
      </ListItemButton>
    </ListItem>
  ));
};

export default MenuLinks;
