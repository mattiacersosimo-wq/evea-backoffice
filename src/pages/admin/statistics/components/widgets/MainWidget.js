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

MainWidget.propTypes = {
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

export default function MainWidget({
  title,
  total,
  icon,
  color = "primary",
  chartData,
}) {
  const { palette } = useTheme();

  return (
    <>
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
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {title}
          </Typography>
        </Box>
      </RootStyle>
    </>
  );
}
