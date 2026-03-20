//prettier-ignore
import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useRef, useState } from "react";
import EventsShowDialog from "src/components/events-show-dialog";
import useQueryParams from "src/hooks/useQueryParams";
import useResponsive from "src/hooks/useResponsive";
import {
  CalendarStyle,
  CalendarToolbar,
} from "src/sections/@dashboard/calendar/index.js";
import "./style.css";

export default function Calendar({ events, setFilter }) {
  const isDesktop = useResponsive("up", "sm");
  const calendarRef = useRef(null);
  const [date, setDate] = useState(new Date());

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      const date = calendarApi.getDate();
      // setFilter(moment(date).startOf("month"), moment(date).endOf("month"));
      setDate(date);
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      const date = calendarApi.getDate();
      // setFilter(moment(date).startOf("month"), moment(date).endOf("month"));
      setDate(date);
    }
  };

  const { addParam } = useQueryParams();

  const handleSelectEvent = (arg) => {
    addParam("event", arg.event.id);
  };
  const { palette } = useTheme();
  const isDark = palette.mode === "dark";

  return (
    <>
      <Card
        className={isDark ? "user-calender" : "lightCalender"}
        sx={{
          padding: "0rem",
          height: "fit-content",
          borderRadius: "7px",
        }}
      >
        <CalendarStyle>
          <CalendarToolbar
            date={date}
            onNextDate={handleClickDateNext}
            onPrevDate={handleClickDatePrev}
          />
          <FullCalendar
            weekends
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView="dayGridMonth"
            dayMaxEventRows={1}
            headerToolbar={false}
            allDayMaintainDuration
            showNonCurrentDates={true}
            eventResizableFromStart
            eventClick={handleSelectEvent}
            height={isDesktop ? "auto" : "auto"}
            plugins={[dayGridPlugin, interactionPlugin]}
          />
        </CalendarStyle>
      </Card>

      <EventsShowDialog />
    </>
  );
}
