import { Card, Typography } from "@mui/material";

import Translate from "src/components/translate";
import UserNotes from "src/pages/admin/members/Profile/components/Notes/index.js";

const ProfileNotes = () => {
  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          {/* <Translate> {"profile.your_notes"}</Translate> */}
        </Typography>
        <UserNotes />
      </Card>
    </div>
  );
};

export default ProfileNotes;
