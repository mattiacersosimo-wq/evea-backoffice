import { Box, Card } from "@mui/material";
import { Outlet } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_USER } from "src/routes/paths";
import { ProfileCover } from "src/sections/user/profile";
import ProfileTabs from "./components/profile-tabs";

const UserProfile = () => {
  return (
    <Page title="profile.title">
      <Box>
        <HeaderBreadcrumbs
          heading="profile.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "global.user" },
          ]}
        />
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
        <Outlet />
      </Box>
    </Page>
  );
};

export default UserProfile;
