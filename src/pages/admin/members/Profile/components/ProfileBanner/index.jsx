import { Card } from "@mui/material";
import ProfileCover from "./ProfileCover";
import ProfileTabs from "./ProfileTabs";
const ProfileBanner = () => {
  return (
    <Card
      sx={{
        mb: 3,
        height: 280,
        position: "relative",
      }}
    >
      <ProfileCover />
      <ProfileTabs />
    </Card>
  );
};

export default ProfileBanner;
