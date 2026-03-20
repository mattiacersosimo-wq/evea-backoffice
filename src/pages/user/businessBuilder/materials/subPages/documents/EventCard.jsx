import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

const EventCard = ({ image, time, title }) => (
  <Card>
    <CardMedia
      component="img"
      height="140"
      image={`${image}?t=${Date.now()}`}
      alt="event"
    />

    <CardContent>
      <Typography>
        {new Date(time).toLocaleDateString("en-GB", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
        })}
      </Typography>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default EventCard;
