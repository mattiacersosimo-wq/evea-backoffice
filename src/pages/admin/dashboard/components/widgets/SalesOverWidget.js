import { Box, Button, CardHeader, TextField, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import merge from "lodash/merge";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import { BaseOptionChart } from "src/components/chart";

import axiosInstance from "src/utils/axios";

const useSalesChart = () => {
  const [data, setData] = useState({});

  const fetchData = async (year = new Date().getFullYear()) => {
    try {
      const { status, data } = await axiosInstance(
        "/api/admin/dashboard/sales-over-the-time",
        {
          params: {
            year: year,
          },
        }
      );

      if (status === 200) {
        const { data: series } = data;

        const parsedSeries = series.map((item) => {
          const [name, seriesData] = Object.values(item);
          return { name: capitalCase(name), data: seriesData };
        });
        setData(parsedSeries);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { sales: data, fetchData };
};

export const genYears = (min = 1990, max = 2099) =>
  Array.from(new Array(max), (_, i) => i + min);

export default function SalesOverWidget() {
  const [seriesData, setSeriesData] = useState(new Date().getFullYear());
  const { sales, fetchData } = useSalesChart();
  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };
  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: "top", horizontalAlign: "right" },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  });

  useEffect(() => {
    fetchData(seriesData);
  }, [seriesData]);

  const [startDate, setStartDate] = useState(new Date());
  const day = startDate.getDate().toString().padStart(2, "0");
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const year = startDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const { t } = useTranslation();
  return (
    <>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            {t("business.salesOverTheTime")}
          </Typography>
        }
        subheader={t("business.allIncomeAndExpense")}
        action={
          <>
            <Box
              sx={{
                display: "grid",
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <TextField
                select
                fullWidth
                value={seriesData}
                SelectProps={{ native: true }}
                onChange={handleChangeSeriesData}
                sx={{
                  "& fieldset": { border: "0 !important" },
                  "& select": {
                    pl: 1,
                    py: 0.5,
                    pr: "24px !important",
                    typography: "subtitle2",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0.75,
                    bgcolor: "background.neutral",
                  },
                  "& .MuiNativeSelect-icon": {
                    top: 4,
                    right: 0,
                    width: 20,
                    height: 20,
                  },
                }}
              >
                {genYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </TextField>
            </Box>
          </>
        }
      />

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={sales}
          options={chartOptions}
          height={270}
        />
      </Box>
    </>
  );
}
