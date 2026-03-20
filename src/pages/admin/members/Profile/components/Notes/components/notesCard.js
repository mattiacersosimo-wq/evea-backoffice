import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Iconify from "src/components/Iconify";
import SvgIconStyle from "src/components/SvgIconStyle";
import TextMaxLine from "src/components/TextMaxLine";

import * as yup from "yup";
import { useMemberProfileContext } from "../../..";
import DeleteDialog from "./deleteDialog";
import NotesEditDialog from "./editDialog";
import Translate from "src/components/translate";

const schema = yup.object().shape({
  notes: yup.string().required("Notes is required"),
});

const defaultValues = {
  notes: "",
};

const NotesCard = ({ notes, fetchNotes }) => {
  const { memberProfile } = useMemberProfileContext();
  const memberName = memberProfile?.user_profile?.username;
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";

  const { id, notes: description, users } = notes;
  const [deleteId, setDeleteId] = useState(null);
  const onClose = () => setDeleteId(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const openEdit = () => {
    setIsEditOpen(true);
    methods.reset({
      notes: description,
      id: id,
    });
  };

  const closeNotes = () => {
    setIsEditOpen(false);
  };

  return (
    <>
      <Box>
        <Card>
          <Box
            sx={{
              backgroundColor: isDark ? "#0000003d" : "aliceblue",
              borderRadius: "10px",
              display: "grid",
              columnGap: 2,
              padding: 1,
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(2, 1fr)",
              },
            }}
          >
            <Box>
              <Typography variant="caption">
                <Iconify icon="solar:user-bold-duotone" /> {memberName}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Tooltip title="Edit">
                <IconButton
                  name="edit"
                  color="info"
                  size="small"
                  onClick={openEdit}
                >
                  <Iconify icon="basil:edit-outline" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  name="delete"
                  color="error"
                  size="small"
                  onClick={() => setDeleteId(id)}
                >
                  <Iconify icon="fluent:delete-24-regular" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box>
              <Typography variant="subtitle2">{description}</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <DeleteDialog
        fetchNotes={fetchNotes}
        deleteId={deleteId}
        onClose={onClose}
      />
      <NotesEditDialog
        fetchNotes={fetchNotes}
        open={isEditOpen}
        onClose={closeNotes}
        methods={methods}
        title={<Translate>profile.notes.dialog.edit.title</Translate>}
        notes={notes}
      />
    </>
  );
};

export default NotesCard;
