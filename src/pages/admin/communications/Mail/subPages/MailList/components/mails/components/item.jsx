import { Box, Checkbox, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Link as RouterLink, useParams } from "react-router-dom";
import Avatar from "src/components/Avatar";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import useAuth from "src/hooks/useAuth";
import useResponsive from "src/hooks/useResponsive";
import createAvatar from "src/utils/createAvatar";
import { fDate } from "src/utils/formatTime";
import Action from "../../Action";

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up("md")]: { display: "flex", alignItems: "center" },
  "&:hover": {
    zIndex: 999,
    position: "relative",
    boxShadow: theme.customShadows.z24,
    "& .showActions": { opacity: 1 },
  },
}));

const WrapStyle = styled(Link)(({ theme }) => ({
  minWidth: 0,
  display: "flex",
  padding: theme.spacing(2, 0),
  transition: theme.transitions.create("padding"),
}));

const Item = ({
  mail,
  isDense,
  isSelected,
  onSelect,
  openDelete,
  linkTo,
  ...other
}) => {
  const { isAdmin, isSubAdmin } = useAuth();

  const params = useParams();
  const checkSent = params.systemLabel === "sent";

  const isInbox = isAdmin
    ? params.systemLabel === "inbox"
    : params.systemLabel === "inbox";
  const isDesktop = useResponsive("up", "md");
  const isAttached = mail.files.length > 0;
  return (
    <>
      <RootStyle
        sx={{
          ...(mail.isUnread && {
            color: "text.primary",
            backgroundColor: checkSent ? "action.selected" : "background.paper",
          }),
          ...(isSelected && { bgcolor: "action.selected" }),
        }}
        {...other}
      >
        {isDesktop && (
          <Box sx={{ mr: 2, display: "flex" }}>
            <Checkbox checked={isSelected} onChange={() => onSelect(mail.id)} />
          </Box>
        )}

        <WrapStyle
          color="inherit"
          underline="none"
          component={RouterLink}
          to={linkTo(params, mail.id, isAdmin || isSubAdmin)}
          sx={{
            ...(isDense && { py: 1 }),
          }}
        >
          <Avatar
            alt={mail?.from_id?.name}
            src={mail?.from_id?.avatar || ""}
            color={createAvatar(mail?.user_id[0].username).color}
            sx={{ width: 32, height: 32 }}
          >
            {
              createAvatar(
                isInbox ? mail?.from_id?.name : mail?.user_id[0].username
              ).name
            }
          </Avatar>

          <Box
            sx={{
              ml: 2,
              minWidth: 0,
              alignItems: "center",
              display: { md: "flex" },
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                pr: 2,
                minWidth: 200,
                fontWeight: mail.isUnread
                  ? checkSent
                    ? "text.secondary"
                    : "fontWeightBold"
                  : "inherit",
              }}
            >
              {isInbox ? mail?.from_id?.name : mail?.user_id[0].username}
            </Typography>

            <Typography
              noWrap
              variant="body2"
              sx={{
                minWidth: 320,
                pr: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: mail.isUnread
                    ? checkSent
                      ? "text.secondary"
                      : "fontWeightBold"
                    : "inherit",
                }}
              >
                {mail.subject}
              </Box>
            </Typography>

            {isDesktop && (
              <>
                {isAttached && (
                  <Iconify
                    icon={"eva:link-fill"}
                    sx={{
                      mx: 2,
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                    }}
                  />
                )}
              </>
            )}
            <Typography
              variant="caption"
              sx={{
                flexShrink: 0,
                minWidth: 120,
                textAlign: "right",
                fontWeight: mail.isUnread
                  ? checkSent
                    ? "text.secondary"
                    : "fontWeightBold"
                  : "inherit",
              }}
            >
              <ParseDate date={mail.createdAt} />
            </Typography>
          </Box>
        </WrapStyle>

        <Action className="showActions" handleDelete={openDelete(mail.id)} />
      </RootStyle>
    </>
  );
};

Item.propTypes = {
  mail: PropTypes.object.isRequired,
  isDense: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
};

export default Item;
