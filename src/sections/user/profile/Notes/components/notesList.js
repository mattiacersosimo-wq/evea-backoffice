import { Box, Button, Grid } from "@mui/material";

import NotesCard from "./notesCard";

const NotesList = ({ fetchNotes, notes, setEditNotes }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ flexGrow: 1, mb: 3 }}>
        <Box
          sx={{
            columnGap: 2,
            columnCount: { xs: 1, md: 2, lg: 3 },
          }}
        >
          {notes?.map((notes) => (
            <Box
              key={notes.id}
              sx={{
                mb: 2,
                "&:last-child": {
                  clear: "both",
                },
              }}
            >
              <NotesCard
                notes={notes}
                fetchNotes={fetchNotes}
                setEditNotes={() => setEditNotes(notes)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NotesList;
