import { useTheme } from "@mui/material/styles";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="95%">
      <AreaChart
        width={550}
        height={150}
        data={data}
        margin={{ top: 30, right: 10, left: 0, bottom: 0 }}
        fontSize="12px"
        fontWeight="300"
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1C47A8" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#1C47A8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#348efe" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#348efe" stopOpacity={0} />
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
        <Legend
          iconType="square"
          verticalAlign="bottom"
          height={36}
          align="center"
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Package"
          stroke="#1C47A8"
          strokeWidth={2}
          fillOpacity={0.8}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="Product"
          stroke="#348efe"
          fillOpacity={0.8}
          strokeWidth={2}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
