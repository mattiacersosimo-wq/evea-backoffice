import { Box, Button, Grid, Stack } from "@mui/material";

import NotesCard from "./notesCard";

const NotesList = ({ fetchNotes, notes, setEditNotes }) => {
  return (
    <Grid item xs={12} md={7}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "grid",
            rowGap: 3,
            columnGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(3, 1fr)",
            },
          }}
        >
          {notes?.map((notes) => (
            <NotesCard
              notes={notes}
              fetchNotes={fetchNotes}
              setEditNotes={() => setEditNotes(notes)}
            />
          ))}
        </Box>
      </Stack>
    </Grid>
  );
};

export default NotesList;
