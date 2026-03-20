import { Box, Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import merge from "lodash/merge";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { BaseOptionChart } from "src/components/chart";
import Translate from "src/components/translate";

import { fPercent } from "src/utils/formatNumber";

const getPercentage = (total, current) => (current / total) * 100;
export default function CustomersWidget({ total_customers, active_customers }) {
  const theme = useTheme();
  const [activePercentage, setActivePercentage] = useState(0);

  useEffect(() => {
    setActivePercentage(getPercentage(total_customers, active_customers) || 0);
  }, [total_customers, active_customers]);
  const { t } = useTranslation();
  return (
    <Card sx={{ p: 2 }}>
      <Box
        sx={{
          justifyContent: "center",
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.8 }}>
            <Translate>business.customers</Translate>
          </Typography>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {total_customers}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            <Translate>business.total_customers</Translate>
          </Typography>

          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {active_customers}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            <Translate>business.active_customers</Translate>
          </Typography>
        </Box>
        <Box height={activePercentage ? "initial" : 170}>
          {activePercentage ? (
            <ReactApexChart
              type="radialBar"
              series={[activePercentage]}
              options={generator(t)(theme)(activePercentage)}
              height={170}
            />
          ) : null}
        </Box>
      </Box>
    </Card>
  );
}

export const generator =
  (t) =>
  (theme) =>
  (percent = 0) => {
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
              label: t("business.active"),
              formatter: () => fPercent(percent),
            },
          },
        },
      },
    });
  };
