import { Alert, Box, Card, Grid, Typography } from "@mui/material";

import AdminProfileNotes from "src/sections/user/profile/Notes/index.js";

const ProfileNotes = () => {
  return (
    <div>
      <Card sx={{ p: 3 }}>
        {/* <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          {("profile.yourNotess")}
        </Typography> */}

        <AdminProfileNotes />
      </Card>
    </div>
  );
};

export default ProfileNotes;
