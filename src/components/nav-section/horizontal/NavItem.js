import PropTypes from "prop-types";
import { forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";
// @mui
import { Box, Link } from "@mui/material";
// config
import { ICON } from "../../../config";
//
import { useTranslation } from "react-i18next";
import SvgIconStyle from "src/components/SvgIconStyle";
import { useAppConfig } from "src/store/app-config";
import { isExternalLink } from "..";
import Iconify from "../../Iconify";
import { ListItemStyle } from "./style";
import useAuth from "src/hooks/useAuth";

// ----------------------------------------------------------------------

export const NavItemRoot = forwardRef(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { t } = useTranslation();
    const { title, path, icon, children, isLead } = item;
    const { config } = useAppConfig();
    const leadsEnable = Boolean(config?.leads_enable?.status);

    if (isLead) {
      if (!leadsEnable) return null;
    }

    if (children?.length > 0) {
      return (
        <ListItemStyle
          ref={ref}
          open={open}
          activeRoot={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent icon={icon} title={t(title)} children={children} />
        </ListItemStyle>
      );
    }

    return isExternalLink(path) ? (
      <ListItemStyle
        component={Link}
        href={path}
        target="_blank"
        rel="noopener"
      >
        <NavItemContent icon={icon} title={t(title)} children={children} />
      </ListItemStyle>
    ) : (
      <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
        <NavItemContent icon={icon} title={t(title)} children={children} />
      </ListItemStyle>
    );
  },
);

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

export const NavItemSub = forwardRef(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const isPromoter = Boolean(Number(user?.is_promoter));
    const { title, path, icon, children, isKyc } = item;
    const { config } = useAppConfig();
    const kycEnable = Boolean(config?.kyc_enable?.status);
    if (isKyc) {
      if (!kycEnable) return null;
    }

    if (title === "user_nav.online_store.packages" && !isPromoter) return null;

    if (children?.length > 0) {
      return (
        <ListItemStyle
          ref={ref}
          subItem
          disableRipple
          open={open}
          activeSub={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent
            icon={icon}
            title={t(title)}
            children={children}
            subItem
          />
        </ListItemStyle>
      );
    }

    return isExternalLink(path) ? (
      <ListItemStyle
        subItem
        href={path}
        disableRipple
        rel="noopener"
        target="_blank"
        component={Link}
      >
        <NavItemContent
          icon={icon}
          title={t(title)}
          children={children}
          subItem
        />
      </ListItemStyle>
    ) : (
      <ListItemStyle
        disableRipple
        component={RouterLink}
        to={path}
        activeSub={active}
        subItem
      >
        <NavItemContent
          icon={icon}
          title={t(title)}
          children={children}
          subItem
        />
      </ListItemStyle>
    );
  }
);

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

NavItemContent.propTypes = {
  children: PropTypes.array,
  icon: PropTypes.any,
  subItem: PropTypes.bool,
  title: PropTypes.string,
};

function NavItemContent({ icon, title, children, subItem }) {
  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            "& svg": { width: "100%", height: "100%" },
          }}
        >
          <SvgIconStyle src={icon} sx={{ width: 1, height: 1 }} />
        </Box>
      )}
      {title}
      {children?.length > 0 && (
        <Iconify
          icon={subItem ? "eva:chevron-right-fill" : "eva:chevron-down-fill"}
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        />
      )}
    </>
  );
}
