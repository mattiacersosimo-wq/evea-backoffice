import { Card, CardHeader, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
import { BaseOptionChart } from "src/components/chart";
import EmptyTable from "src/components/emptyTable";

import { fNumber } from "src/utils/formatNumber";
import useActiveUsers from "./hooks/useActiveUsers";

const CHART_HEIGHT = 250;
const LEGEND_HEIGHT = 50;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

const CHART_DATA = [85, 75];

const ActiveUserWidget = () => {
  const theme = useTheme();
  const { active_left_customers, active_right_customers, total_customers } =
    useActiveUsers();

  const chartOptions = merge(BaseOptionChart(), {
    labels: ["userDashboard.rightLeg", "userDashboard.leftLeg"],
    legend: { floating: true, horizontalAlign: "center" },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          [
            {
              offset: 0,
              color: theme.palette.primary.light,
            },
            {
              offset: 100,
              color: theme.palette.primary.main,
            },
          ],
          [
            {
              offset: 0,
              color: theme.palette.warning.light,
            },
            {
              offset: 100,
              color: theme.palette.warning.main,
            },
          ],
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "68%" },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            formatter: () => fNumber(total_customers),
          },
        },
      },
    },
  });

  return (
    <>
      <Card sx={{ borderRadius: "7px" }}>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              {"userDashboard.activeUsers"}
            </Typography>
          }
        />
        <ChartWrapperStyle dir="ltr">
          {Boolean(total_customers) ? (
            <ReactApexChart
              type="radialBar"
              series={[active_right_customers, active_left_customers]}
              options={chartOptions}
              height={230}
            />
          ) : (
            <EmptyTable title="No Data Available" />
          )}
        </ChartWrapperStyle>
      </Card>
    </>
  );
};

export default ActiveUserWidget;
