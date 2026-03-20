import { Box, Link, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
import { NavLink as RouterLink } from "react-router-dom";
import SvgIconStyle from "src/components/SvgIconStyle";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useIsHoldingTank from "src/hooks/use-is-holding-tank";
import { useAppConfig } from "src/store/app-config";
import { isExternalLink } from "..";
import Iconify from "../../Iconify";
import { ListItemIconStyle, ListItemStyle, ListItemTextStyle } from "./style";
import useAuth from "src/hooks/useAuth";

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  isCollapse: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

export function NavItemRoot({
  item,
  isCollapse,
  open = false,
  active,
  onOpen,
}) {
  const { title, path, icon, info, children, isAffiliate, isLead } = item;
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPromoter = Boolean(Number(user?.is_promoter));
  const isHoldingTank = useIsHoldingTank();
  const disabledMenu =
    isHoldingTank && Boolean(isAffiliate) && !isPromoter;
  const { config } = useAppConfig();
  const leadsEnable = Boolean(config?.leads_enable?.status);

  if (Boolean(isAffiliate) && !isPromoter) {
    return null;
  }

  if (isLead) {
    if (!leadsEnable) return null;
  }

  const renderContent = (
    <>
      {icon && (
        <ListItemIconStyle>
          <SvgIconStyle src={icon} sx={{ width: 1, height: 1 }} />
        </ListItemIconStyle>
      )}
      <ListItemTextStyle
        disableTypography
        primary={t(title)}
        isCollapse={isCollapse}
      />
      {!isCollapse && (
        <>
          {info && info}
          {children?.length > 0 && <ArrowIcon open={open} />}
        </>
      )}
    </>
  );

  if (children?.length > 0) {
    return (
      <ListItemStyle
        disabled={disabledMenu}
        onClick={onOpen}
        activeRoot={active}
      >
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle
      disabled={disabledMenu}
      component={Link}
      href={path}
      target="_blank"
      rel="noopener"
    >
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle
      disabled={disabledMenu}
      component={RouterLink}
      to={path}
      activeRoot={active}
    >
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    info: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { title, path, info, children, isAffiliate, isKyc } = item;
  const { t } = useTranslation();

  const isHoldingTank = useIsHoldingTank();
  const disabledMenu = isHoldingTank && Boolean(isAffiliate);
  const { user } = useAuth();
  const isPromoter = Boolean(Number(user?.is_promoter));
  const { config } = useAppConfig();
  const kycEnable = Boolean(config?.kyc_enable?.status);
  if (isKyc) {
    if (!kycEnable) return null;
  }
  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={t(title)} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );
  
  if (title === "user_nav.online_store.packages" && !isPromoter)
    return null;

  if (children) {
    return (
      <ListItemStyle
        disabled={disabledMenu}
        onClick={onOpen}
        activeSub={active}
        subItem
      >
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle
      disabled={disabledMenu}
      component={Link}
      href={path}
      target="_blank"
      rel="noopener"
      subItem
    >
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle
      disabled={disabledMenu}
      component={RouterLink}
      to={path}
      activeSub={active}
      subItem
    >
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

DotIcon.propTypes = {
  active: PropTypes.bool,
};

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: "scale(2)",
            bgcolor: "primary.main",
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

ArrowIcon.propTypes = {
  open: PropTypes.bool,
};

export function ArrowIcon({ open }) {
  return (
    <Iconify
      icon={open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  );
}
