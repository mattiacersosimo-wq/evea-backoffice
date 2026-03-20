import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Card, CardContent, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function EventsList({ events }) {
  return (
    <Card
      sx={{
        "& .MuiTimelineItem-missingOppositeContent:before": {
          display: "none",
        },
      }}
    >
      <CardContent>
        <Timeline>
          {events.map((item, index) => (
            <OrderItem
              key={item.id}
              item={item}
              isLast={index === events.length - 1}
            />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    created_at: PropTypes.instanceOf(Date),
    topic: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { topic: title, created_at: time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {new Date(time).toLocaleDateString("en-GB")}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
