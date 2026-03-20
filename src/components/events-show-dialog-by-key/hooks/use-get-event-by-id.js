import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import getEventsList from "src/api/user/events";
import useQueryParams from "src/hooks/useQueryParams";

const useGetEventById = () => {
  const { queryObject } = useQueryParams();

  const { enqueueSnackbar } = useSnackbar();
  const { event } = queryObject;
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchEvent = async () => {
      const { data, status, message } = await getEventsList({
        key: event,
      });

      if (status) {
        setData(data);
      } else enqueueSnackbar(message, { variant: "error" });
    };
    if (event > -1) {
      fetchEvent();
    }

    return () => {
      setData({});
    };
  }, [event]);

  return data;
};

export default useGetEventById;
