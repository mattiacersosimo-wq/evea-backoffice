import moment from "moment";
import { useEffect, useReducer, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import URI from "src/utils/urlConfig";
import TYPES from "../TYPES";

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

const useRegisterData = () => {
  const [dateRange, updateDate] = useReducer(reducer, {
    start_date: serializeDate(moment().startOf("week")),
    end_date: serializeDate(moment().endOf("week")),
    value: TYPES.thisWeek,
  });

  const handleErrors = useErrors();
  const [data, setData] = useState({
    members: 0,
    holding_tank: 0,
    network_members: 0,
    business_builder_members: 0,
    members_yesterday: 0,
    holding_tank_yesterday: 0,
    network_members_yesterday: 0,
    members_this_month: 0,
    holding_tank_this_month: 0,
    network_members_this_month: 0,
  });

  const { start_date, end_date } = dateRange;
  useEffect(() => {
    const fetchData = async (filter) => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.network.registeredMembers,
          {
            params: { ...filter },
          }
        );

        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

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

export default useRegisterData;
