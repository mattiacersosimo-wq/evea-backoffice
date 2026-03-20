import merge from "lodash/merge";
import PropTypes from "prop-types";
// @mui
import { Box, Card, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
// utils
import { BaseOptionChart } from "src/components/chart";
import { fNumber } from "src/utils/formatNumber";
// components
import Iconify from "src/components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  position: "relative",
  alignItems: "center",
  padding: theme.spacing(3),
}));

// ----------------------------------------------------------------------

SubscriptionsWidgets.propTypes = {
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

export default function SubscriptionsWidgets({
  title,
  total,
  icon,
  color = "primary",
  chartData,
}) {
  const { palette } = useTheme();

  return (
    <>
      <Card>
        <RootStyle>
          <Box>
            <Iconify
              icon={icon}
              width={32}
              height={32}
              sx={{ color: palette.primary.main }}
            />
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4"> {fNumber(total)}</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
              {title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.72, fontSize: "13px" }}
            >
              {"adminStatistics.newPurchase"} : 545
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.72, fontSize: "13px" }}
            >
              {"adminStatistics.repeatedPurchase"} : 588
            </Typography>
          </Box>
        </RootStyle>
        <Box
          sx={{
            display: "grid",
            rowGap: 3,
            columnGap: 2,
            marginTop: 1,
            padding: 1,
            gridTemplateColumns: {
              xs: "repeat(4, 1fr)",
              sm: "repeat(4, 1fr)",
            },
          }}
        >
          <Box textAlign="center">
            <Typography variant="subtitle2">128</Typography>
            <Typography variant="caption">
              1 {"adminStatistics.month"}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle2">99564</Typography>
            <Typography variant="caption">
              3 {"adminStatistics.month"}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle2">6565</Typography>
            <Typography variant="caption">
              6 {"adminStatistics.month"}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="subtitle2">99</Typography>
            <Typography variant="caption">
              12 {"adminStatistics.month"}
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
}
