import { Box, Checkbox, Link, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { Link as RouterLink, useParams } from "react-router-dom";
import Avatar from "src/components/Avatar";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { PATH_DASHBOARD } from "src/routes/paths";
import createAvatar from "src/utils/createAvatar";
import { fDate } from "src/utils/formatTime";
import Action from "../../Action";
import useAuth from "src/hooks/useAuth";

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
  const params = useParams();
  const { isAdmin } = useAuth();
  const isDesktop = useResponsive("up", "md");

  const isAttached = mail.files.length > 0;
  return (
    <RootStyle
      sx={{
        ...(!mail.isUnread && {
          color: "text.primary",
          backgroundColor: "background.paper",
        }),
        ...(isSelected && { bgcolor: "action.selected" }),
      }}
      {...other}
    >
      {isDesktop && (
        <Box sx={{ mr: 2, display: "flex" }}>
          <Checkbox checked={isSelected} onChange={onSelect} />
          <Tooltip title="Starred">
            <Checkbox
              color="warning"
              defaultChecked={mail.isStarred}
              icon={<Iconify icon={"eva:star-outline"} />}
              checkedIcon={<Iconify icon={"eva:star-fill"} />}
            />
          </Tooltip>
          <Tooltip title="Important">
            <Checkbox
              color="warning"
              defaultChecked={mail.isImportant}
              checkedIcon={<Iconify icon={"ic:round-label-important"} />}
              icon={<Iconify icon={"ic:round-label-important"} />}
            />
          </Tooltip>
        </Box>
      )}

      <WrapStyle
        color="inherit"
        underline="none"
        component={RouterLink}
        to={linkTo(params, mail.id, isAdmin)}
        sx={{ ...(isDense && { py: 1 }) }}
      >
        <Avatar
          alt={mail?.from_id?.name}
          src={mail?.from_id?.avatar || ""}
          color={createAvatar(mail?.from_id?.name).color}
          sx={{ width: 32, height: 32 }}
        >
          {createAvatar(mail?.from_id?.name).name}
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
              ...(!mail.isUnread && { fontWeight: "fontWeightBold" }),
            }}
          >
            {mail?.from_id?.name}
          </Typography>

          <Typography
            noWrap
            variant="body2"
            sx={{
              pr: 2,
            }}
          >
            <Box
              component="span"
              sx={{ ...(!mail.isUnread && { fontWeight: "fontWeightBold" }) }}
            >
              {mail.subject}
            </Box>
            &nbsp;-&nbsp;
          </Typography>
          <Typography
            noWrap
            variant="body2"
            sx={{
              pr: 2,
            }}
          >
            <Box
              component="span"
              sx={{
                ...(!mail.isUnread && { color: "text.secondary" }),
              }}
            >
              <ReactQuill
                value={mail.message}
                readOnly
                theme="bubble"
                modules={{
                  toolbar: false,
                }}
              />
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
              ...(!mail.isUnread && { fontWeight: "fontWeightBold" }),
            }}
          >
            {fDate(mail.createdAt)}
          </Typography>
        </Box>
      </WrapStyle>

      <Action className="showActions" handleDelete={openDelete(mail.id)} />
    </RootStyle>
  );
};

Item.propTypes = {
  mail: PropTypes.object.isRequired,
  isDense: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
};

export default Item;
