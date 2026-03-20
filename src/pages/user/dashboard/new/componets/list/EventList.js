import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Box, CardContent, Typography } from "@mui/material";
import { upperCase } from "lodash";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DataHandlerList from "src/components/data-handler/list";
import Loop from "src/components/loop";
import Ternary from "src/components/ternary";
import useQueryParams from "src/hooks/useQueryParams";
import { PATH_USER } from "src/routes/paths";
import { getClientTime } from "src/utils/dateTime";

const getLabel = (tab) => {
  switch (tab) {
    case "today":
      return "NO EVENTS FOUND FOR TODAY!";
    case "active":
      return "NO PRIVATE EVENTS FOUND!";
    case "public":
      return "NO PUBLIC EVENTS FOUND!";
    default:
      return "NO EVENTS FOUND";
  }
};

const EmptyContent = ({ tab }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Typography>{getLabel(tab)}</Typography>
  </Box>
);

export default function EventList({ events, tab }) {
  const { addParam } = useQueryParams();

  const onClick = (key) => addParam("event", key);

  const hasEvents = events.length > 0;

  return (
    <Box
      sx={{
        "& .MuiTimelineItem-missingOppositeContent:before": {
          display: "none",
        },
      }}
    >
      <CardContent>
        <Ternary
          when={hasEvents}
          then={
            <Timeline>
              <Loop
                list={events.slice(0, 3)}
                render={(item, index) => (
                  <EventsCard
                    onClick={onClick}
                    key={item.key}
                    item={item}
                    isLast={index === events.length - 1}
                  />
                )}
              />

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography
                    component={Link}
                    to={PATH_USER.events}
                    color="GrayText"
                    variant="subtitle2"
                    sx={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    more
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          }
          otherwise={<EmptyContent tab={tab} />}
        />
      </CardContent>
    </Box>
  );
}

EventsCard.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function EventsCard({ item, onClick }) {
  const { topic: title, converted_date_in_utc, key } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color="primary" />

        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography
          variant="subtitle2"
          sx={{ cursor: "pointer" }}
          onClick={() => onClick(key)}
        >
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {getClientTime(converted_date_in_utc)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
