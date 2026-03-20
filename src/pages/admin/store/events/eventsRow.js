import { IconButton, TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

const EventsRow = ({ events, handleOpenMenu, row, disableAction }) => {
  const {
    id,
    event_type,
    location_url,
    zoom_password,
    duration,
    host,
    topic,
    date,
    time,
  } = events;

  return (
    <TableRow key={id}>
      <TableCell>{row}</TableCell>
      <TableCell>{capitalCase(event_type)}</TableCell>
      <TableCell>{location_url}</TableCell>
      <TableCell>{zoom_password}</TableCell>
      <TableCell>
        <ParseDate date={date} />
      </TableCell>
      <TableCell>{time}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>{host}</TableCell>
      <TableCell>{topic}</TableCell>
      <TableCell>
        <IconButton
          disabled={disableAction}
          onClick={handleOpenMenu(id)}
          name="more-button"
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default EventsRow;
