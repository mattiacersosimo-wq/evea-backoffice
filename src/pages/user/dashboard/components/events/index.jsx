import moment from "moment";
import { useMemo, useState } from "react";
import Calendar from "src/pages/user/dashboard/components/events/components/calender.js";

const Events = ({ events }) => {
  const [filter, setFilter] = useState({
    monthStart: moment().startOf("month"),
    monthEnd: moment().endOf("month"),
  });
  const { monthEnd, monthStart } = filter;
  const eventsList = useMemo(() => {
    return (
      events
        // .filter(({ converted_date_in_utc }) =>
        //   moment(converted_date_in_utc).isBetween(monthStart, monthEnd)
        // )
        .map(({ converted_date_in_utc, topic, key }) => {
          return {
            id: key,
            title: topic,
            date: moment(converted_date_in_utc).format("YYYY-MM-DD"),
          };
        })
    );
  }, [events, monthStart, monthEnd]);
  return (
    <>
      <Calendar
        events={eventsList}
        setFilter={(start, end) =>
          setFilter({ monthStart: start, monthEnd: end })
        }
      />
    </>
  );
};

export default Events;
