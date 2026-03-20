import { Card } from "@mui/material";

import NotesNew from "./new-notes/index";

const ProfileNotes = () => {
  return (
    <div>
      <Card sx={{ p: 3 }}>
        <NotesNew />
      </Card>
    </div>
  );
};

export default ProfileNotes;
