import { Button, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DialogProvider, useDialogContext } from "src/components/customDialog";
import Iconify from "src/components/Iconify";
import DocumentDialog from "./dialogs/documents";
import EventsDialog from "./dialogs/events";
import ReviewDialog from "./dialogs/reviewDialog";
import VideoDialog from "./dialogs/video";

const ActionButton = ({ icon, color, label, name = "", href }) => {
  const { palette } = useTheme();
  const { open } = useDialogContext();
  const navigate = useNavigate();
  const { mode } = palette;
  return (
    <Button
      onClick={() => {
        if (href) navigate(href);
        else open(name);
      }}
      startIcon={<Iconify icon={icon} />}
      size="small"
      sx={{
        paddingRight: "0.8rem",
        paddingLeft: "0.8rem",
        color: color[mode],
        borderColor: color[mode],
        "&:hover": {
          backgroundColor: `${color[mode]}10`,
          borderColor: color[mode],
        },
      }}
    >
      {label}
    </Button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  href: PropTypes.string,
  isFirst: PropTypes.bool.isRequired,
};

export default () => {
  const [openDialog, setOpenDialog] = useState("");

  const actionButtons = [
    {
      icon: "bi:check-lg",
      label: "Add review",
      color: { light: "#00c853", dark: "#69f0ae" },
      name: "review",
    },
    {
      icon: "akar-icons:link-chain",
      label: "Blog",
      color: { light: "#0091ea", dark: "#40c4ff" },
      href: "/user/blogs",
    },
    {
      icon: "uil:calender",
      label: "Events",
      color: { light: "#25223e", dark: "#eeff41" },
      name: "events",
    },
    {
      icon: "healthicons:i-documents-accepted-outline",
      label: "Documents",
      color: { light: "#d50000", dark: "#ff4081" },
      name: "documents",
    },
    {
      icon: "akar-icons:play",
      label: "Video",
      color: { light: "#ff6d00", dark: "#ffd740" },
      name: "video",
    },
  ];

  return (
    <DialogProvider value={{ openDialog, open: (name) => setOpenDialog(name) }}>
      <Stack spacing={1} direction="row" sx={{ marginTop: "1rem" }}>
        {actionButtons.map((v) => (
          <ActionButton {...v} />
        ))}
      </Stack>
      <ReviewDialog name="review" />
      <EventsDialog name="events" />
      <VideoDialog name="video" />
      <DocumentDialog name="documents" />
    </DialogProvider>
  );
};
