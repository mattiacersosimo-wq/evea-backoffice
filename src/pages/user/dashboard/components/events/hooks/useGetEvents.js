import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useGetEvents = () => {
  const [events, setEvents] = useState([]);
  const handleErrors = useErrors();

  const fetchEvents = async (month, year) => {
    try {
      const { status, data } = await fetchUser("events-calendar", {
        params: {
          month: month,
          year: year,
        },
      });
      if (status === 200) {
        setEvents(data.data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    const eventPeriod = new Date();
    fetchEvents(eventPeriod.getMonth() + 1, eventPeriod.getFullYear());
  }, []);

  return { events, fetchEvents };
};

export default useGetEvents;
