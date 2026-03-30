import { Divider, Stack, Typography } from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
};

export default function CalendarForm({ event }) {
  const {
    date,
    description,
    src,
    duration,
    hostTime,
    location_url,
    zoom_password,
  } = event;

  // console.log(event);

  // const clientDateTine = getClientTime(converted_date_in_utc);

  // const hostDateTime = getHostTime(start_date, time, timezone);

  return (
    <>
      <Stack spacing={1} sx={{ p: 3, "& ql-editor": { padding: 0 } }}>
        <img src={src ? src : "/bitcoinTaf.png"} />
        <ReactQuill
          value={description}
          theme="bubble"
          modules={{
            toolbar: null,
          }}
          readOnly
        />
        <Divider />

        <Stack spacing={1}>
          <IconItems
            icon="material-symbols:location-on-outline"
            title="Date && Time"
            value={moment(date).format("DD MMMM YYYY")}
          />
          <IconItems
            icon="ic:round-hourglass-top"
            title="Duration"
            value={duration}
          />
          <IconItems
            icon="ic:outline-access-time"
            title="Host Time"
            value={moment(hostTime).format("HH:mm:ss")}
          />
        </Stack>
        <Divider />
        <Stack spacing={1}>
          <Stack>
            <Typography variant="subtitle2" sx={{ fontSize: "12px" }}>
              Location/Zoom URL/Twitter Space Url
            </Typography>
            <Typography variant="body2">{location_url}</Typography>
          </Stack>
          <Ternary
            when={zoom_password}
            then={
              <Stack>
                <Typography variant="subtitle2">Zoom Password</Typography>
                <Typography variant="body2">{zoom_password}</Typography>
              </Stack>
            }
          />
        </Stack>
      </Stack>
    </>
  );
}

const IconItems = ({ icon, title, value }) => (
  <Stack direction="row" alignItems="center" spacing={0.8}>
    <Iconify
      icon={icon}
      sx={{
        fontSize: "1.5rem",
      }}
    />
    <Stack>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  </Stack>
);
