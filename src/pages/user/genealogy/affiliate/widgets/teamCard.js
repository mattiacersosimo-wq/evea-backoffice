import PropTypes from "prop-types";
import merge from "lodash/merge";
import ReactApexChart from "react-apexcharts";
// @mui
import { useTheme, styled, alpha } from "@mui/material/styles";
import { Card, Typography, Box } from "@mui/material";
// components
import Iconify from "src/components/Iconify";
import { Currency } from "src/components/with-prefix";
import Translate from "src/components/translate";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  position: "relative",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker,
}));

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: "absolute",
  right: theme.spacing(-3),
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

export default function AppWidget({ title, total, icon }) {
  const theme = useTheme();

  return (
    <RootStyle>
      <IconStyle icon={icon} sx={{ p: 3 }} />
      <Box sx={{ ml: 3, color: "common.white" }}>
        <Typography variant="body2" sx={{ opacity: 0.55 }}>
          <Translate>{title}</Translate>
        </Typography>
        <Typography variant="h4">
          <Currency> {total}</Currency>
        </Typography>
      </Box>
    </RootStyle>
  );
}
