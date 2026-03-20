import { useTheme } from "@mui/material/styles";
import merge from "lodash/merge";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { BaseOptionChart } from "src/components/chart";

const CustomRadialChart = ({ count }) => {
  const theme = useTheme();
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const temp = count === 0 || Number(count);
    setShowChart(temp);
  }, [count]);

  return showChart ? (
    <ReactApexChart
      type="radialBar"
      series={[count]}
      options={countGenerator(theme)(count)}
      height={200}
    />
  ) : null;
};

export const countGenerator =
  (theme) =>
  (count = 0) => {
    return merge(BaseOptionChart(), {
      legend: { show: false },
      fill: {
        type: "gradient",
        gradient: {
          colorStops: [
            [
              { offset: 0, color: theme.palette.primary.light },
              { offset: 100, color: theme.palette.primary.main },
            ],
          ],
        },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: "60%" },
          dataLabels: {
            name: { offsetY: -16 },
            value: { offsetY: 8 },
            total: {
              label: "Active",
              formatter: () => count,
            },
          },
        },
      },
    });
  };

export default CustomRadialChart;
