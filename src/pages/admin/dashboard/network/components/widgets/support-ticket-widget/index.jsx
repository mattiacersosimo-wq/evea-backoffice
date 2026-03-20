import { Box, Card, CardHeader, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";

import { useTheme } from "@mui/material/styles";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import Translate from "src/components/translate";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import Legends from "./components/legends";

const useSupportTickets = () => {
  const handleErrors = useErrors();
  const [data, setData] = useState({
    all_tickets: 0,
    open_tickets: 0,
    closed_tickets: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await axiosInstance(
          URI.admin.network.supportTickets
        );
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return data;
};

const SupportTicketWidget = () => {
  const { all_tickets, closed_tickets, open_tickets } = useSupportTickets();
  const theme = useTheme();

  const data = [
    {
      name: "Closed",
      value: closed_tickets,
      type: 1,
      fill: theme.palette.primary.dark,
    },
    {
      name: "Open",
      value: open_tickets,
      type: 2,
      fill: theme.palette.primary.light,
    },
  ];

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <CardHeader
        sx={{ padding: 0 }}
        title={
          <Typography variant="subtitle2">
            <Translate>network.support_tickets</Translate>
          </Typography>
        }
      />
      <Box
        sx={{
          height: "80px",
          width: "100%",
          display: "flex",
          mt: "20px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack textAlign="center" spacing={1} sx={{ width: "100px" }}>
          <Typography variant="countText">{all_tickets}</Typography>
          <Typography
            variant="subtitle3"
            sx={{ fontSize: "15px", fontWeight: "300" }}
          >
            <Translate>global.total_tickets</Translate>
          </Typography>
        </Stack>

        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: { xl: "row", xs: "column" },
            alignItems: { sm: "center", xs: "flex-end" },
            width: { xl: "230px", xs: "calc(100% - 100px)" },
            mt: { md: "12px", xs: "-10px" },
          }}
        >
          <Legends closed={closed_tickets} open={open_tickets} />

          <Box sx={{ height: "90px", width: "170px" }}>
            <ResponsiveContainer width="100%">
              <PieChart>
                {/* <text x={115} y={60} textAnchor="middle" dominantBaseline="middle">
              Active
            </text> */}
                <Pie
                  startAngle={180}
                  endAngle={0}
                  data={data}
                  dataKey="value"
                  isAnimationActive={true}
                  cx={85}
                  cy={75}
                  outerRadius={80}
                  innerRadius={60}
                  fill={theme.palette.primary.light}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

SupportTicketWidget.propTypes = {
  chartColor: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.number),
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default SupportTicketWidget;
