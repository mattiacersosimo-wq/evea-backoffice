import { Avatar } from "@mui/material";
import useAuth from "src/hooks/useAuth";

const UserImage = ({ username }) => {
  const { user } = useAuth();
  return <Avatar src={user?.user_profile?.profile_image}>{username}</Avatar>;
};

export default UserImage;
