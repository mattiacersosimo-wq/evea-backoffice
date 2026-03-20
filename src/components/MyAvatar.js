import { capitalize, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";
import Avatar from "./Avatar";

export default function MyAvatar({ ...other }) {
  const {
    user: { user_profile, username },
  } = useAuth();
  return (
    <Avatar
      src={user_profile?.profile_image}
      alt={username}
      {...other}
      style={{ textTransform: "capitalize" }}
    >
      {username?.slice(0, 1)}
    </Avatar>
  );
}

export const MemberAvatar = ({ uri, name, variant, ...other }) => {
  return (
    <Avatar src={uri} alt={name} {...other} variant={variant}>
      <Typography>{name?.slice(0, 1)}</Typography>
    </Avatar>
  );
};
