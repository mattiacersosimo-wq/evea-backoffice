import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_USER } from "src/routes/paths";

const LABEL_ICONS = {
  dashboard: "ic:round-dashboard",
  all: "fa:ticket",
  overdue: "icon-park-solid:file-date-one",
  open: "bxs:folder-open",
  resolved: "el:ok-circle",
  closed: "ci:off-outline-close",
  inprogress: "mdi:progress-clock",
  responded: "akar-icons:pointer-right-fill",
};

const SidebarItem = ({ label, ...other }) => {
  const linkTo = PATH_USER.helpCenter.createTicket.subCategory(label.slug);

  const { t } = useTranslation();

  return (
    <ListItemButton
      component={NavLink}
      to={linkTo}
      sx={{
        px: 3,
        height: 48,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        "&.active": {
          color: "text.primary",
          fontWeight: "fontWeightMedium",
          bgcolor: "action.selected",
        },
      }}
      {...other}
      name={label.id}
    >
      <ListItemIcon>
        <Iconify
          icon={LABEL_ICONS[label.id]}
          style={{ color: label.color }}
          width={24}
          height={24}
        />
      </ListItemIcon>

      <ListItemText disableTypography primary={t(label.name)} />
    </ListItemButton>
  );
};

SidebarItem.propTypes = {
  label: PropTypes.object.isRequired,
};

export default SidebarItem;
