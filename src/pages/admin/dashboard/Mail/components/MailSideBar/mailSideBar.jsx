import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { SkeletonMailSidebarItem } from "src/components/skeleton";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import Compose from "../compose";

const LABEL_ICONS = {
  all: "eva:email-fill",
  inbox: "eva:inbox-fill",
  trash: "eva:trash-2-outline",
  drafts: "eva:file-fill",
  spam: "ic:round-report",
  sent: "ic:round-send",
  starred: "eva:star-fill",
  important: "ic:round-label-important",
  id_social: "eva:share-fill",
  id_promotions: "ic:round-label",
  id_forums: "ic:round-forum",
};

const linkTo = (label, isAdmin) => {
  const baseUrl = isAdmin
    ? PATH_DASHBOARD.mail.root
    : PATH_USER.helpCenter.mails.root;

  if (label.type === "system") {
    return `${baseUrl}/${label.id}`;
  }
  if (label.type === "custom") {
    return `${baseUrl}/label/${label.name}`;
  }
  return baseUrl;
};

const MailSidebarItem = ({ label, ...other }) => {
  const isUnread = label.unreadCount > 0;
  const { user } = useAuth();
  return (
    <ListItemButton
      to={linkTo(label, user.is_super_admin)}
      component={RouterLink}
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
    >
      <ListItemIcon>
        <Iconify
          icon={LABEL_ICONS[label.id]}
          style={{ color: label.color }}
          width={24}
          height={24}
        />
      </ListItemIcon>

      <ListItemText disableTypography primary={label.name} />

      {isUnread && (
        <Typography variant="caption">{label.unreadCount}</Typography>
      )}
    </ListItemButton>
  );
};

MailSidebarItem.propTypes = {
  label: PropTypes.object.isRequired,
};

const MailSideBar = ({ onClick = () => null, labels }) => {
  const [open, setOpen] = useState(false);

  const loading = !labels?.length;

  return (
    <>
      <Scrollbar>
        <Compose isOpenCompose={open} onCloseCompose={() => setOpen(false)} />

        <Divider />

        <List disablePadding>
          {(loading ? [...Array(8)] : labels).map((label, index) =>
            label ? (
              <MailSidebarItem key={label.id} label={label} onClick={onClick} />
            ) : (
              <SkeletonMailSidebarItem key={index} />
            )
          )}
        </List>
      </Scrollbar>
    </>
  );
};

export default MailSideBar;
