import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  Card,
  Stack,
  Divider,
  CardHeader,
  Typography,
} from "@mui/material";
// hooks
import useResponsive from "src/hooks/useResponsive";
//
import { BaseOptionChart } from "src/components/chart";
import ChartJoin from "./chart";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  "& .apexcharts-legend": {
    width: 240,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      flexWrap: "wrap",
      height: 160,
      width: "50%",
    },
  },
  "& .apexcharts-datalabels-group": {
    display: "none",
  },
}));

// ----------------------------------------------------------------------

const CHART_DATA = {
  labels: ["0.5", "1.1", "2.8", "3.4", "4.5", "5.0", "5.3", "6.0", "7.0"],
  data: [14, 23, 21, 17, 15, 10, 12, 17, 21],
};

export default function BankingExpensesCategories() {
  const theme = useTheme();

  const isDesktop = useResponsive("up", "sm");

  return (
    <RootStyle>
      <Box sx={{ my: 5 }} dir="ltr">
        <ChartJoin />
      </Box>

      <Divider />

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box sx={{ py: 2, width: 1, textAlign: "center" }}>
          <Typography
            sx={{ mb: 1, typography: "body2", color: "text.secondary" }}
          >
            Weekly Joining
          </Typography>
          <Typography sx={{ typography: "h4" }}>102</Typography>
        </Box>

        <Box sx={{ py: 2, width: 1, textAlign: "center" }}>
          <Typography
            sx={{ mb: 1, typography: "body2", color: "text.secondary" }}
          >
            Monthly Joining
          </Typography>
          <Typography sx={{ typography: "h4" }}>714</Typography>
        </Box>
        <Box sx={{ py: 2, width: 1, textAlign: "center" }}>
          <Typography
            sx={{ mb: 1, typography: "body2", color: "text.secondary" }}
          >
            Yearly Joining
          </Typography>
          <Typography sx={{ typography: "h4" }}>5,8741</Typography>
        </Box>
      </Stack>
    </RootStyle>
  );
}
