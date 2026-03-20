import { Grid, Stack } from "@mui/material";
import HideFromSubAdmin from "src/components/hide-from-subadmin";
import UserLoginActivity from "src/components/user-login-activity";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowInfo from "./ProfileFollowInfo";
import ProfileSponsorCard from "./ProfileSponsorCard";
import ProfileTwoCard from "./ProfileTwoCard";

export default function Profile() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <HideFromSubAdmin>
            <ProfileFollowInfo />
          </HideFromSubAdmin>
          <ProfileAbout mt={1} />
          <HideFromSubAdmin>
            <ProfileTwoCard />
          </HideFromSubAdmin>
          <HideFromSubAdmin>
            <ProfileSponsorCard />
          </HideFromSubAdmin>
        </Stack>
      </Grid>

      <Grid id item xs={12} md={8}>
        <Stack spacing={3}>
          <UserLoginActivity />
        </Stack>
      </Grid>
    </Grid>
  );
}
