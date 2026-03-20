import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import MyAvatar from "src/components/MyAvatar";
import useAuth from "src/hooks/useAuth";
import { PATH_DASHBOARD } from "src/routes/paths";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.3, 2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
}));

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { user } = useAuth();
  return (
    <Link
      underline="none"
      color="inherit"
      component={RouterLink}
      to={PATH_DASHBOARD.root}
    >
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: "transparent",
          }),
        }}
      >
        <MyAvatar src={user?.user_profile?.profile_image} />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {user?.user_profile?.first_name}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
            {user?.username}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
