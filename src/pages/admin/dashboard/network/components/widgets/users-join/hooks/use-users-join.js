import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import TYPES from "../../registered-members/TYPES";

const reducer = (state, type) => {
  switch (type) {
    case TYPES.thisWeek: {
      return {
        start_date: serializeDate(moment().startOf("week")),
        end_date: serializeDate(moment().endOf("week")),
        value: TYPES.thisWeek,
      };
    }

    case TYPES.lastWeek: {
      return {
        start_date: serializeDate(moment().subtract(1, "week").startOf("week")),
        end_date: serializeDate(moment().subtract(1, "week").endOf("week")),
        value: TYPES.lastWeek,
      };
    }

    case TYPES.thisMonth: {
      return {
        start_date: serializeDate(moment().startOf("month")),
        end_date: serializeDate(moment().endOf("month")),
        value: TYPES.thisMonth,
      };
    }
    case TYPES.lastMonth: {
      return {
        start_date: serializeDate(
          moment().subtract(1, "month").startOf("month")
        ),
        end_date: serializeDate(moment().subtract(1, "month").endOf("month")),
        value: TYPES.lastMonth,
      };
    }
    case TYPES.thisYear: {
      return {
        start_date: serializeDate(moment().startOf("year")),
        end_date: serializeDate(moment().endOf("year")),
        value: TYPES.thisYear,
      };
    }
    default: {
      return state;
    }
  }
};

const useUsersJoin = () => {
  const [data, setData] = useState([]);

  const [dateRange, updateDate] = useReducer(reducer, {
    start_date: serializeDate(moment().startOf("week")),
    end_date: serializeDate(moment().endOf("week")),
    value: TYPES.thisWeek,
  });

  const handleErrors = useErrors();
  const fetchData = async (filter) => {
    try {
      const { data, status } = await axiosInstance(
        "api/admin/dashboard/users-join",
        {
          params: { ...filter },
        }
      );

      if (status === 200) {
        const { holding_tank, network } = data.data || {};

        const chartData = Object.entries(holding_tank).map(([k, v]) => {
          return {
            name: moment(k).format("DD"),
            holding_tank: v,
            network: network[k],
          };
        });
        setData(chartData);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  const { start_date, end_date } = dateRange;

  useEffect(() => {
    fetchData({
      start_date,
      end_date,
    });
  }, [start_date, end_date]);

  const onDateChange = (v) => {
    updateDate(v);
  };

  return { data, onDateChange, dateRange };
};

export default useUsersJoin;
