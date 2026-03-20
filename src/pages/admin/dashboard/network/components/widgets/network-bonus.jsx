import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useReducer, useState } from "react";
import useErrors from "src/hooks/useErrors";

import moment from "moment";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import serializeDate from "src/utils/serialize-date";
import URI from "src/utils/urlConfig";
import TYPES from "./registered-members/TYPES";
import DateDropdown from "./registered-members/components/date-dropdown";

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

const useNetworkBonus = () => {
  const [bonus, setBonus] = useState([]);

  const [dateRange, updateDate] = useReducer(reducer, {
    start_date: serializeDate(moment().startOf("week")),
    end_date: serializeDate(moment().endOf("week")),
    value: TYPES.thisWeek,
  });

  const handleErrors = useErrors();
  const fetchData = async (filter) => {
    try {
      const { data, status } = await axiosInstance(
        URI.admin.network.bonusGraph,
        {
          params: { ...filter },
        }
      );

      if (status === 200) {
        setBonus(
          Object.entries(data.data).map(([k, v]) => ({
            name: moment(k).format("DD"),
            bonus: parseFloat(v),
          }))
        );
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

  return { bonus, onDateChange, dateRange };
};

const NetworkBonus = () => {
  const { bonus, dateRange, onDateChange } = useNetworkBonus();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardHeader
        sx={{
          mb: 5,
        }}
        title={
          <Typography variant="subtitle2">
            <Translate>network.network_bonus</Translate>
          </Typography>
        }
        action={
          <DateDropdown onDateChange={onDateChange} dateRange={dateRange} />
        }
      />
      <CardContent
        sx={{ p: 0, display: "flex", alignItems: "flex-end", height: "300px" }}
      >
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            height={250}
            data={bonus}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            fontSize="12px"
            color={theme.palette.grey[300]}
            fontWeight="300"
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1FD59D" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#1FD59D" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* <XAxis dataKey="name" />
            <YAxis allowDecimals={false} /> */}
            <XAxis
              dataKey="name"
              fontSize="10px"
              fontWeight="300"
              tick={{
                fill:
                  theme.palette.mode === "light"
                    ? theme.palette.widgets.grpahtext[100]
                    : theme.palette.widgets.grpahtext[100],
              }}
              axisLine={{
                stroke:
                  theme.palette.mode === "light"
                    ? theme.palette.widgets.grpahtext[100]
                    : theme.palette.widgets.grpahtext[100],
              }}
            />
            <YAxis
              allowDecimals={false}
              fontSize="10px"
              fontWeight="300"
              tick={{
                fill:
                  theme.palette.mode === "light"
                    ? theme.palette.widgets.grpahtext[100]
                    : theme.palette.widgets.grpahtext[100],
              }}
              axisLine={{
                stroke:
                  theme.palette.mode === "light"
                    ? theme.palette.widgets.grpahtext[100]
                    : theme.palette.widgets.grpahtext[100],
              }}
            />
            <Area
              type="monotone"
              dataKey="bonus"
              stroke="#1FD59D"
              strokeWidth={2}
              fillOpacity={0.7}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NetworkBonus;
