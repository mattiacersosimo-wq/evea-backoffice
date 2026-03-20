import { Box, Divider, MenuItem, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuPopover from "src/components/MenuPopover";
import MyAvatar from "src/components/MyAvatar";
import { IconButtonAnimate } from "src/components/animate";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";

import { PATH_AUTH, PATH_DASHBOARD, PATH_USER } from "src/routes/paths";

export default function AccountPopover() {
  const ADMIN_MENU_OPTIONS = [
    {
      label: "header_menus.home",
      linkTo: PATH_DASHBOARD.root,
    },
    {
      label: "header_menus.profile",
      linkTo: PATH_DASHBOARD.user.profile,
    },
  ];

  const USER_MENU_OPTIONS = [
    {
      label: "header_menus.home",
      linkTo: PATH_USER.root,
    },
    {
      label: "header_menus.profile",
      linkTo: PATH_USER.profile.root,
    },
  ];
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);

  const { user: data, logout, isAdmin, isSubAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin || isSubAdmin) {
      setMenu(ADMIN_MENU_OPTIONS);
    } else {
      setMenu(USER_MENU_OPTIONS);
    }
  }, [isAdmin]);

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar
          sx={{ width: "30px", height: "30px" }}
          src={data.user_profile?.profile_image}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {data.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {data.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {menu.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              <Translate>{option.label}</Translate>
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          <Translate>header_menus.logout</Translate>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
