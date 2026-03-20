import {
  Box,
  Card,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useReducer, useState } from "react";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

import axiosInstance from "src/utils/axios";
import { fNumber } from "src/utils/formatNumber";
import serializeDate from "src/utils/serialize-date";
import TYPES from "../../network/components/widgets/registered-members/TYPES";
import DateDropdown from "../../network/components/widgets/registered-members/components/date-dropdown";

const IconWrapperStyle = styled("div")(({ theme }) => ({
  width: 24,
  height: 24,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1),
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

BalanceWidget.propTypes = {
  chartColor: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.number),
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

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

const useBalanceWidget = () => {
  const [data, setData] = useState({
    total_sales: "",
    total_expense: "",
    total_profit: "",
  });

  const [dateRange, updateDate] = useReducer(reducer, {
    start_date: serializeDate(moment().startOf("week")),
    end_date: serializeDate(moment().endOf("week")),
    value: TYPES.thisWeek,
  });

  const { start_date, end_date } = dateRange;

  const fetchData = async (filter = {}) => {
    try {
      const { data, status } = await axiosInstance(
        "/api/admin/dashboard/sales-performance",
        {
          params: { ...filter },
        }
      );

      if (status === 200) {
        const { payout, performance, sales } = data.data || {};

        setData({
          total_sales: sales,
          total_expense: payout,
          total_profit: performance,
        });
      }
    } catch (err) {
      console.err(err);
    }
  };

  useEffect(() => {
    fetchData({
      start_date,
      end_date,
    });
  }, [start_date, end_date]);

  const onDateChange = (v) => {
    updateDate(v);
  };
  return { balance: data, fetchData, onDateChange, dateRange };
};

export default function BalanceWidget({ title }) {
  const { balance, fetchData, onDateChange, dateRange } = useBalanceWidget();
  const [value, setValue] = useState(1);
  const handleChange = (event) => {
    const v = parseInt(event.target.value);
    fetchData(v);
    setValue(v);
  };

  const {
    total_expense: expense,
    total_profit: profit,
    total_sales: sales,
  } = balance;

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ lineHeight: "1.2" }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ fontSize: "12px" }}>
            <DateDropdown onDateChange={onDateChange} dateRange={dateRange} />
          </Box>
        </Box>
        <Typography variant="countText" sx={{ fontSize: "26px" }} gutterBottom>
          <Currency>{profit}</Currency>
        </Typography>

        <Box
          sx={{
            display: "grid",
            rowGap: 3,
            columnGap: 2,
            mt: "14px",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 2fr)",
              md: "repeat(2, 2fr)",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            style={{ flexWrap: "wrap" }}
          >
            <IconWrapperStyle
              sx={{
                color: "success.main",
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
              }}
            >
              <Iconify width={16} height={16} icon="eva:trending-up-fill" />
            </IconWrapperStyle>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xl: "15px", lg: "13px" },
                }}
              >
                + <Currency>{sales}</Currency>
              </Typography>
              <Typography
                variant="subtitle3"
                noWrap
                sx={{ fontSize: "13px", fontWeight: "300" }}
              >
                &nbsp; <Translate>business.income</Translate>
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            alignItems="flex-start"
            style={{ flexWrap: "wrap" }}
          >
            <IconWrapperStyle
              sx={{
                color: "error.main",
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
              }}
            >
              <Iconify width={16} height={16} icon="eva:trending-down-fill" />
            </IconWrapperStyle>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: { xl: "15px", lg: "13px" },
                }}
              >
                - <Currency>{expense}</Currency>
              </Typography>
              <Typography
                variant="subtitle3"
                noWrap
                sx={{ fontSize: "13px", fontWeight: "300" }}
              >
                &nbsp; <Translate>business.expense</Translate>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}
