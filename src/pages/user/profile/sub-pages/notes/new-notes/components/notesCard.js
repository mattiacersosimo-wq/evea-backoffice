import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Card,
  CardContent,
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
import useAuth from "src/hooks/useAuth";

import { useTranslation } from "react-i18next";
import * as yup from "yup";
import DeleteDialog from "./deleteDialog";
import NotesEditDialog from "./editDialog";

const schema = yup.object().shape({
  notes: yup.string().required("errors.profile.notes.note.required"),
});

const defaultValues = {
  notes: "",
};

const NotesCard = ({ notes, fetchNotes }) => {
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";

  const { user } = useAuth();
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
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Card>
          <CardContent
            sx={{
              backgroundColor: isDark ? "#0000003d" : "aliceblue",
              borderRadius: "10px",
              height: "1px",
            }}
          >
            <Box sx={{ maxHeight: "1px" }}>
              <Typography variant="caption">
                <Iconify icon="solar:user-bold-duotone" /> {user?.username}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Tooltip title={t("global.edit")}>
                <IconButton
                  name="edit"
                  color="info"
                  size="small"
                  onClick={openEdit}
                >
                  <Iconify icon="basil:edit-outline" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("global.delete")}>
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
          </CardContent>
          <Box sx={{ p: 2 }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "300", lineHeight: "24px" }}
              >
                {description}
              </Typography>
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
        notes={notes}
      />
    </>
  );
};

export default NotesCard;
