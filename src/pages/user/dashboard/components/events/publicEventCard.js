import PropTypes from "prop-types";
// @mui
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
// utils
import { fDateTime } from "src/utils/formatTime";
// _mock_
import { _analyticOrderTimeline } from "src/_mock";
// components
import Iconify from "src/components/Iconify";

// ----------------------------------------------------------------------

export default function PublicEventCard() {
  return (
    <Card
      sx={{
        "& .MuiTimelineItem-missingOppositeContent:before": {
          display: "none",
        },
      }}
    >
      <CardHeader title="Public Events" />
      <CardContent>
        <Timeline>
          {_analyticOrderTimeline.map((item, index) => (
            <EventsCard
              key={item.id}
              item={item}
              isLast={index === _analyticOrderTimeline.length - 1}
            />
          ))}
        </Timeline>
        <Box sx={{ p: 1, textAlign: "right" }}>
          <Button
            to="#"
            size="small"
            color="info"
            endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
          >
            View all
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

EventsCard.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function EventsCard({ item, isLast }) {
  const { type, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === "order1" && "primary") ||
            (type === "order2" && "success") ||
            (type === "order3" && "info") ||
            (type === "order4" && "warning") ||
            "error"
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">New year events upcoming </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
