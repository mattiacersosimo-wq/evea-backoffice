import useAuth from "../hooks/useAuth";
import Avatar from "./Avatar";
import { capitalize } from "@mui/material";

export default function MyAvatar({ ...other }) {
  const {
    user: { user_profile, username },
  } = useAuth();
  return (
    <Avatar
      src={user_profile?.profile_image}
      alt={username}
      {...other}
      style={{ textTransform: "capitalize", fontSize: "4rem" }}
    >
      {username?.slice(0, 1)}
    </Avatar>
  );
}

export const MemberAvatar = ({ uri, name, variant, ...other }) => {
  return (
    <Avatar src={uri} alt={name} {...other} variant={variant}>
      {/* {createAvatar(name)} */}
    </Avatar>
  );
};
