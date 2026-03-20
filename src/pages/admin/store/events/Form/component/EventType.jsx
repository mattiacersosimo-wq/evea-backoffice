import React from "react";
import { RHFSelect } from "src/components/hook-form";

const EventType = () => {
  return (
    <RHFSelect name="event_type" label={"events.add_event.event_type"}>
      <option value="" />
      <option value="webinar">Webinar</option>
      <option value="offline">Offline</option>
      <option value="twitter">X Space</option>
    </RHFSelect>
  );
};

export default EventType;
