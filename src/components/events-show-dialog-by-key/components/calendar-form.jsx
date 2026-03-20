import { Divider, IconButton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import { getClientTime, getHostTime } from "src/utils/dateTime";

const isValidURI = (URI) => {
  try {
    new URL(URI);
    return true;
  } catch (err) {
    return false;
  }
};

const CalendarForm = ({ event }) => {
  const {
    description,
    image,
    duration,
    location_url,
    zoom_password,
    converted_date_in_utc,
    start_date,
    time,
    timezone,
  } = event;

  const clientDateTine = getClientTime(converted_date_in_utc);
  const hostDateTime = getHostTime(start_date, time, timezone);
  const isURI = isValidURI(location_url);

  return (
    <>
      <Stack spacing={1} sx={{ p: 3, "& ql-editor": { padding: 0 } }}>
        <img
          height={200}
          style={{
            objectFit: "contain",
          }}
          src={image ? image : "/bitcoinTaf.png"}
        />
        <Stack spacing={1}>
          <IconItems
            icon="material-symbols:location-on-outline"
            title="Date & Time"
            value={clientDateTine}
          />
          <IconItems
            icon="ic:round-hourglass-top"
            title="Duration"
            value={duration}
          />
          <IconItems
            icon="ic:outline-access-time"
            title="Host Time"
            value={hostDateTime}
          />
        </Stack>
        <Divider />

        <Stack spacing={1}>
          <Stack
            sx={{
              wordBreak: "break-word",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontSize: "12px" }}>
              Location/Zoom URL/Twitter Space Url{" "}
              <Ternary
                when={isURI}
                then={
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText(location_url)}
                  >
                    <Iconify icon="ic:baseline-content-copy" />
                  </IconButton>
                }
              />
            </Typography>
            <Typography
              sx={{
                width: "100%",
              }}
              variant="body2"
              target="_blank"
              component={isURI ? "a" : "p"}
              href={location_url}
            >
              {location_url}
            </Typography>
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
        <Divider />

        <ReactQuill
          value={description}
          theme="bubble"
          modules={{
            toolbar: null,
          }}
          readOnly
        />
      </Stack>
    </>
  );
};

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

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
};

export default CalendarForm;
