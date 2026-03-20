import { Box, Card, Chip, Typography } from "@mui/material";
import PropTypes from "prop-types";
// utils
// components
import { useTheme } from "@mui/material/styles";
import Image from "src/components/Image";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import { genLabel } from "./utils";

NetworkBalanceWidget.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
  icon: PropTypes.string,
};

export default function NetworkBalanceWidget({
  title,
  total,
  icon,
  prev,
  bgColor,
}) {
  const theme = useTheme();
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <Box>
            <Chip
              label={genLabel(prev)}
              size="small"
              sx={{
                bgcolor:
                  prev >= 0
                    ? theme.palette.widgets.green[100]
                    : theme.palette.widgets.red[100],
                color:
                  prev >= 0
                    ? theme.palette.widgets.green[500]
                    : theme.palette.widgets.red[500],
              }}
            />

            <Typography
              noWrap
              sx={{
                mt: 1,
                color: "text.secondary",
                fontSize: "14px",
                fontWeight: "200",
              }}
            >
              <Translate>business.thenLastMonth</Translate>
            </Typography>
          </Box> */}

          <Box
            sx={{
              width: "50px",
              height: "50px",
              borderRadius: "5px",
              bgcolor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: "7px",
            }}
          >
            <Image src={icon} alt="dolar" />
          </Box>
        </Box>

        <Typography
          variant="countText"
          sx={{ mb: 0, mt: 1.3, fontSize: "21px", display: "block" }}
          gutterBottom
        >
          <Currency>{total}</Currency>
        </Typography>
        <Typography
          variant="subtitle3"
          sx={{ fontWeight: "300", fontSize: "16px" }}
        >
          {title}
        </Typography>
      </Box>
    </Card>
  );
}
