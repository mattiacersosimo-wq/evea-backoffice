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

export const MemberAvatar = ({ uri, name, ...other }) => {
  return (
    <Avatar src={uri} alt={name} {...other}>
      {/* {createAvatar(name)} */}
    </Avatar>
  );
};
