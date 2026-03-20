import { Box, Card, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  position: "relative",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker,
  minHeight: 190,
}));

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: "absolute",
  right: theme.spacing(-3),
  color: theme.palette.common.white,
}));

AppWidget.propTypes = {
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

export default function AppWidget({ total, icon, color = "primary" }) {
  const theme = useTheme();

  return (
    <RootStyle
      sx={{
        bgcolor: theme.palette[color].darker,
      }}
    >
      <img width={180} />
      <Box sx={{ ml: 3, color: "common.white" }}>
        <Typography variant="body2" sx={{ opacity: 0.55 }}>
          <Translate> {"affiliate_dashboard.upcoming_week"}</Translate>
        </Typography>
        <Typography variant="h4">
          <Currency> {total}</Currency>
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          <Translate> {"affiliate_dashboard.binary_bonus"}</Translate>
        </Typography>
      </Box>
      <IconStyle icon={icon} />
    </RootStyle>
  );
}
