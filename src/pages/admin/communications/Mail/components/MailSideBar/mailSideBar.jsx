import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, NavLink as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import { SkeletonMailSidebarItem } from "src/components/skeleton";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";

import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";

const LABEL_ICONS = {
  // all: "eva:email-fill",
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

const MailSidebarItem = ({ fetchData, label, ...other }) => {
  useEffect(() => {
    fetchData();
  }, []);
  const isUnread = label.unreadCount > 0;
  const { user } = useAuth();

  return (
    <ListItemButton
      to={linkTo(label, user.is_super_admin || user.is_sub_admin)}
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

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    send: test("send"),
  };
};

const MailSideBar = ({
  onClick = () => null,
  labels,
  disabledCompose,
  fetchData,
}) => {
  const loading = !labels?.length;
  const { send } = genStatus(
    "nav.communication.title",
    "nav.communication.mails"
  );

  const { isAdmin, isSubAdmin } = useAuth();
  const isUser = !(isAdmin || isSubAdmin);

  return (
    <>
      <Scrollbar>
        <Ternary
          when={send || isUser}
          then={
            <>
              <Box sx={{ p: 3 }}>
                <Button
                  disabled={disabledCompose}
                  LinkComponent={Link}
                  to="compose"
                  fullWidth
                  variant="contained"
                  startIcon={<Iconify icon={"eva:plus-fill"} />}
                >
                  <Translate>global.compose</Translate>
                </Button>
              </Box>
              <Divider />
            </>
          }
        />

        <List disablePadding>
          <Ternary
            when={loading}
            then={[...Array(8)].map((_, index) => (
              <SkeletonMailSidebarItem key={index} />
            ))}
            otherwise={labels.map((label) => (
              <Ternary
                key={label.id}
                when={label}
                then={
                  <MailSidebarItem
                    key={label.id}
                    label={label}
                    onClick={onClick}
                    fetchData={fetchData}
                  />
                }
                otherwise={<SkeletonMailSidebarItem key={label.id} />}
              />
            ))}
          />
        </List>
      </Scrollbar>
    </>
  );
};

export default MailSideBar;
