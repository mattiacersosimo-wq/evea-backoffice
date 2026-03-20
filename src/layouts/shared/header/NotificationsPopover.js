import {
  Badge,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import MenuPopover from "src/components/MenuPopover";
import Scrollbar from "src/components/Scrollbar";
import { IconButtonAnimate } from "src/components/animate";
import { DATE_FORMAT } from "src/config";
import useIsUser from "src/hooks/use-is-user";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import fetchUser from "src/utils/fetchUser";

const useChangeNotificationStatus = (fetchData) => {
  const handleError = useErrors();

  const changeStatus = async (id) => {
    const reqData = new FormData();
    reqData.append("_method", "PUT");
    try {
      const { data, status } = await fetchUser.post(
        `notifications/${id}`,
        reqData
      );

      if (status === 200) {
        fetchData();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return changeStatus;
};

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const handleError = useErrors();
  const isUser = useIsUser();

  const fetchData = async (isUser) => {
    const URI = isUser ? "api/user/notifications" : "api/admin/notifications";
    try {
      const { data, status } = await axiosInstance(URI);
      if (status === 200) {
        setNotifications(data.data);
      }
    } catch (err) {
      handleError(err);
    }
  };
  useEffect(() => {
    fetchData(isUser);
  }, [isUser]);

  return { notifications, fetchData };
};

export default function NotificationsPopover() {
  const { notifications, fetchData } = useNotification();
  const totalUnRead = notifications.filter((item) => item.is_read === 0).length;
  const changeStatus = useChangeNotificationStatus(fetchData);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {};

  return (
    <>
      <IconButtonAnimate
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {/* {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )} */}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List disablePadding>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                changeStatus={changeStatus}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ is_read, message, id, changeStatus, created_at }) {
  return (
    <ListItemButton
      onClick={() => changeStatus(id)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(!is_read && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemText
        primary={message}
        primaryTypographyProps={{
          variant: "body2",
        }}
        secondaryTypographyProps={{
          variant: "caption",
          marginTop: 1,
        }}
        secondary={moment(created_at).format(`h:mma ${DATE_FORMAT}`)}
      />
    </ListItemButton>
  );
}
