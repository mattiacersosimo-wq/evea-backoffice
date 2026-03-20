import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  genDate,
  getEvent,
  paintCurrentDateOnMonthChange,
  paintEvents,
} from "../utils";
import useGetEvents from "./useGetEvents";

const useEvents = () => {
  const { palette } = useTheme();
  const [selection, setSelection] = useState(genDate);
  const { events, fetchEvents } = useGetEvents();

  const [value, setValue] = useState(new Date());
  const [activeMonth, setActiveMonth] = useState(
    new Date()
      .toLocaleDateString("en-GB", {
        month: "short",
      })
      .toLowerCase()
  );

  useEffect(() => {
    const element = document.querySelector(".react-calendar__tile--active");
    element.style.backgroundColor = palette.primary.main;
  }, [palette.primary]);

  useEffect(() => {
    paintEvents(events);
  }, [value, events]);

  const onMonthChange = ({ activeStartDate }) => {
    const newDate = new Date(activeStartDate);
    paintCurrentDateOnMonthChange(newDate.getMonth(), palette.primary.main);
    fetchEvents(newDate.getMonth() + 1, newDate.getFullYear());
    newDate.setDate(value.getDate());
    setValue(newDate);
    setActiveMonth(
      new Date(activeStartDate)
        .toLocaleDateString("en-GB", {
          month: "short",
        })
        .toLowerCase()
    );
  };

  const onChange = (v, e) => {
    const newDate = genDate(v);
    setSelection(newDate);
    setValue(v);
    document.querySelectorAll(".react-calendar__tile").forEach((item) => {
      item.style.backgroundColor = "";
    });
    e.target.style.backgroundColor = palette.primary.main;
    const event = getEvent(activeMonth, newDate.selectedDate);
  };

  return { ...selection, onChange, onMonthChange, value, events };
};

export default useEvents;
