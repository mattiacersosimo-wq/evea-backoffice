import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Iconify from "src/components/Iconify";
import useQueryParams from "src/hooks/useQueryParams";
import CalendarForm from "./components/calendar-form";
import useGetEventById from "./hooks/use-get-event-by-id";
import Transition from "src/utils/dialog-animation";

const EventsShowDialog = () => {
  const {
    queryObject: { event },
    deleteParam,
  } = useQueryParams();
  const onClose = () => deleteParam("event");

  const data = useGetEventById();
  return (
    <Dialog
      TransitionComponent={Transition}
      open={Boolean(event) && Boolean(Object.entries(data))}
      onClose={onClose}
      sx={{
        "& .MuiPaper-rounded": {
          maxWidth: "500px",
        },
      }}
    >
      <DialogTitle
        id="category"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{data?.topic}</Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <Iconify icon="ic:baseline-close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <CalendarForm event={data || {}} />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default EventsShowDialog;
