import { Box, Card, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { Currency } from "src/components/with-prefix";

ProfitWidget.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function ProfitWidget({ title, prev, current, icon, bgColor }) {
  // const theme = useTheme();

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box>
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
              <img src={icon} style={{ width: "80%" }} />
            </Box>
          </Box>
        </Box>
        <Typography
          variant="countText"
          sx={{ mb: 0, mt: 1.3, fontSize: "21px", display: "block" }}
          gutterBottom
        >
          <Currency>{current}</Currency>
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
