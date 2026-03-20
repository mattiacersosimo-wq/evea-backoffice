import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "src/utils/formatNumber";
// components
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

SmallWidgets.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  icon: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function SmallWidgets({
  title,
  total,
  icon,
  color = "primary",
}) {
  return (
    <RootStyle
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette[color].dark,
              0
            )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">
        <Currency> {fShortenNumber(total)}</Currency>
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        <Translate>{title}</Translate>
      </Typography>
    </RootStyle>
  );
}
