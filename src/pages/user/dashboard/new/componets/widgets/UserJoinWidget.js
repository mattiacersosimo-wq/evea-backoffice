import { Box, Card, CardHeader, TextField, Typography } from "@mui/material";
import merge from "lodash/merge";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { BaseOptionChart } from "src/components/chart";
import useErrors from "src/hooks/useErrors";

import { genYears } from "src/pages/admin/dashboard/components/widgets/SalesOverWidget";
import fetchUser from "src/utils/fetchUser";

const useSales = () => {
  const handleErrors = useErrors();
  const [data, setData] = useState([]);
  const fetchData = async (year) => {
    const reqData = new FormData();
    reqData.append("year", year);

    try {
      const { status, data } = await fetchUser.post("users-join", reqData);
      if (status === 200) {
        setData(data.data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchData(new Date().toLocaleDateString("en-GB", { year: "numeric" }));
  }, []);
  return { data, fetchData };
};

export default function EcommerceYearlySales() {
  const { data, fetchData } = useSales();

  const [seriesData, setSeriesData] = useState(2023);

  const handleChangeSeriesData = (event) => {
    const year = Number(event.target.value);
    setSeriesData(year);
    fetchData(year);
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

  return (
    <>
      <Card sx={{ borderRadius: "7px" }}>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              {"userDashboard.usersJoin"}
            </Typography>
          }
          subheader={"userDashboard.overview"}
          action={
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
          }
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart
            type="area"
            series={data}
            options={chartOptions}
            height={250}
          />
        </Box>
      </Card>
    </>
  );
}
