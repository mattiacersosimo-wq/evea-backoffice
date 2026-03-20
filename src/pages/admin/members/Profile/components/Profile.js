import { Grid, Stack } from "@mui/material";
import ProfileAbout from "./ProfileAbout";
import ProfileActivityCard from "./ProfileActivityCard";
import ProfileFollowInfo from "./ProfileFollowInfo";
// import ProfileSponsorCard from "./ProfileSponsorCard";
import ProfileTwoCard from "./ProfileTwoCard";
import ShowOnlyForUser from "./show-only-for-user";

export default function Profile() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ShowOnlyForUser>
            <ProfileFollowInfo />
          </ShowOnlyForUser>
          <ProfileAbout />
          <ShowOnlyForUser>
            <ProfileTwoCard />
          </ShowOnlyForUser>

          {/* <ProfileSponsorCard /> */}
        </Stack>
      </Grid>

      <Grid id item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfileActivityCard />
        </Stack>
      </Grid>
    </Grid>
  );
}
