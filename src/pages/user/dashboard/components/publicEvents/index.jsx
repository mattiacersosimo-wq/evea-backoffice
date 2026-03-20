import { Paper, Stack, Typography } from "@mui/material";
import LabeledPaper from "src/components/LabeledPaper";
import data from "./_data";

const PublicEvents = () => {
  return (
    <LabeledPaper label="Public Events">
      {data.map(({ id, ...rest }) => (
        <EventItem {...rest} key={id} />
      ))}
    </LabeledPaper>
  );
};

const getEventTime = (date) => {
  const [hours, minutes] = [date.getUTCHours(), date.getUTCMinutes()];
  return hours < 12 ? `${hours}:${minutes} am` : `${hours - 12}:${minutes} pm`;
};

const EventItem = ({ title, date, image }) => {
  const isoDate = new Date(parseInt(date));
  const eventDate = isoDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Paper variant="outlined" sx={{ padding: "1rem" }}>
      <Stack spacing={1}>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography fontWeight="bold">{eventDate}</Typography>
        <Typography fontWeight="bold">{getEventTime(isoDate)} IST</Typography>
        <Typography
          color="primary"
          sx={{
            textDecoration: "none",
          }}
          component="a"
          href={image}
          target="_blank"
        >
          open Image
        </Typography>
      </Stack>
    </Paper>
  );
};

export default PublicEvents;
