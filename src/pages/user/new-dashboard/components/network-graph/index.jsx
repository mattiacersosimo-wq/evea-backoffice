import { Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Translate from "src/components/translate";
import useGetNetworkGraph from "./hooks/use-get-network-graph";

const NetworkGraph = () => {
  const theme = useTheme();
  const distribution = useGetNetworkGraph();
  return (
    <Card sx={{ height: "310px", pb: "20px" }}>
      <Typography variant="subtitle2" sx={{ mt: 2, px: "20px" }}>
        <Translate>user_dashboard.network.title</Translate>
      </Typography>
      <Typography
        variant="subtitle3"
        sx={{
          mb: 2,
          px: "20px",
          fontWeight: "300",
          fontSize: "13px",
          lineHeight: "1",
          // color: theme.palette.grey[600],
        }}
      >
        <Translate>user_dashboard.network.overview</Translate>
      </Typography>
      <ResponsiveContainer width="95%">
        <AreaChart
          height={50}
          data={distribution}
          margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={theme.palette.primary.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          {/* <XAxis dataKey="name" fontSize="10px" fontWeight="300" />
          <YAxis fontSize="10px" fontWeight="300" /> */}

          <XAxis
            allowDecimals={false}
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

          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip
            itemStyle={{ fontSize: "13px" }}
            labelStyle={{
              fontSize: "13px",
              color: theme.palette.primary.main,
            }}
          />
          <Area
            type="monotone"
            dataKey="User Count"
            stroke={theme.palette.primary.main}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default NetworkGraph;
