import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import merge from "lodash/merge";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { BaseOptionChart } from "src/components/chart";

MembersWidget.propTypes = {
  chartData: PropTypes.number.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default function MembersWidget({ title, count }) {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const temp = count === 0 || Number(count);
    setShowChart(temp);
  }, [count]);

  return (
    <Box>
      {showChart && <Chart count={count} />}

      <Box>
        <Typography variant="caption">{title}</Typography>
      </Box>
    </Box>
  );
}

const Chart = ({ color = "primary", count }) => {
  const theme = useTheme();
  const [data, setData] = useState({
    options: merge(BaseOptionChart(), {
      colors: [theme.palette[color].main],
      chart: { sparkline: { enabled: true } },
      legend: { show: false },
      plotOptions: {
        radialBar: {
          hollow: { size: "78%" },
          track: { margin: 0 },
          dataLabels: {
            showOn: "always",
            name: { show: false },
            value: {
              formatter: function (val) {
                return val;
              },
              offsetY: 6,
              color: theme.palette.common.primary,
              fontSize: theme.typography.subtitle2.fontSize,
              show: true,
            },
          },
        },
      },
    }),
    series: [],
  });

  useEffect(() => {
    setData({ ...data, series: [count] });
  }, [count]);

  return (
    <ReactApexChart
      type="radialBar"
      series={data.series}
      options={data.options}
      width={86}
      height={86}
    />
  );
};
