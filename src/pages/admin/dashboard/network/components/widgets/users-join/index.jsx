import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import DateDropdown from "../registered-members/components/date-dropdown";
import useUsersJoin from "./hooks/use-users-join";
import { useTheme } from "@mui/material/styles";
import Translate from "src/components/translate";

const data = [
  {
    name: "Week 1",
    network: 400,
    holding_tank: 240,
  },
  {
    name: "Week 2",
    network: 300,
    holding_tank: 139,
  },
  {
    name: "Week 3",
    network: 200,
    holding_tank: 980,
  },
  {
    name: "Week 4",
    network: 278,
    holding_tank: 390,
  },
];

const UsersJoin = () => {
  const { data, dateRange, onDateChange } = useUsersJoin();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>global.users_join</Translate>
          </Typography>
        }
        action={
          <DateDropdown dateRange={dateRange} onDateChange={onDateChange} />
        }
      />
      <CardContent sx={{ px: 0 }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            height={250}
            data={data}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            fontSize="11px"
            fontWeight="300"
          >
            {/* <XAxis dataKey="name"  />
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
              formatter={(v) => capitalCase(v)}
              iconType="square"
              align="right"
              verticalAlign="top"
            />
            <Line
              type="monotone"
              dataKey="holding_tank"
              stroke="#1C47A8"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="network"
              stroke="#348efe"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UsersJoin;
