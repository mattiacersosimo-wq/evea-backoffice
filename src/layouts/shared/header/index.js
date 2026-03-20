import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Badge, Box, CircularProgress, Stack, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import { Suspense, useState } from "react";
import Iconify from "src/components/Iconify";
import { IconButtonAnimate } from "src/components/animate";
import Logo from "src/components/logo";
import Settings from "src/components/settings";
import { HEADER } from "src/config";
import useOffSetTop from "src/hooks/useOffSetTop";
import useResponsive from "src/hooks/useResponsive";
import { RootStyle } from "src/layouts/shared";
import AccountPopover from "./AccountPopover";
import NotificationsPopover from "./NotificationsPopover";
import CurrencyPopOver from "./components/currency-popover";
import LanguagePopover from "./language-popover";
import ShopToken from "./ShopToken";
import useAuth from "src/hooks/useAuth";

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: "$spin 8s linear infinite",
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(360deg)",
      },
      "100%": {
        transform: "rotate(0deg)",
      },
    },
  })
);

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
}) {
  const isOffset =
    useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;
  const isDesktop = useResponsive("up", "lg");

  const [openSettings, setOpenSettings] = useState(false);
  const { isAdmin } = useAuth();


  const handleOpenSettings = () => {
    setOpenSettings((prev) => !prev);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const classes = useStyles();

  return (
    <>
      <RootStyle
        isCollapse={isCollapse}
        isOffset={isOffset}
        verticalLayout={verticalLayout}
      >
        <Toolbar
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100% !important",
            px: { lg: 5 },
          }}
        >
          {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

          {!isDesktop && (
            <>
              <IconButtonAnimate
                onClick={onOpenSidebar}
                sx={{ mr: 1, color: "text.primary" }}
              >
                <Iconify icon="eva:menu-2-fill" />
              </IconButtonAnimate>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            {/* {!isDesktop && <QuickPopover />} */}

            <CurrencyPopOver />
            {!isAdmin && <ShopToken/>}
            <NotificationsPopover />
            <Badge
              color="error"
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  top: "7px",
                  right: "7px",
                },
              }}
            >
              <IconButtonAnimate
                onClick={() => handleOpenSettings()}
                className={classes.rotateIcon}
              >
                <Iconify icon="solar:settings-bold-duotone" />
              </IconButtonAnimate>
            </Badge>

            <Suspense fallback={<CircularProgress />}>
              <LanguagePopover />
            </Suspense>
            <AccountPopover />
          </Stack>
        </Toolbar>
      </RootStyle>

      <Settings handleClose={handleCloseSettings} open={openSettings} />
    </>
  );
}
