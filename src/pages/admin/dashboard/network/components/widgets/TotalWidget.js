import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Currency } from "src/components/with-prefix";

TotalWidgets.propTypes = {
  chartColor: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.number),
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

export const ImageWithBackground = ({ bgColor, src }) => {
  return (
    <Box
      sx={{
        padding: 1.2,
        borderRadius: 1,
        width: "fit-content",
        backgroundColor: bgColor,
        marginBottom: 2,
      }}
    >
      <img src={src} width="30px" />
    </Box>
  );
};

export default function TotalWidgets({ title, percent, bgColor, total, src }) {
  const { palette } = useTheme();
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2, height: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <ImageWithBackground bgColor={bgColor} src={src} />

        <Stack mb={0.8} direction="row" alignItems="center" spacing={1}>
          <Typography variant="countText" sx={{ fontSize: "20px" }}>
            <Currency>{total}</Currency>
          </Typography>

          {/* <Chip
            size="small"
            sx={{
              width: "60px",
              backgroundColor:
                percent > 0
                  ? palette.widgets.green[100]
                  : palette.widgets.red[100],
            }}
            label={
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "400",
                  color:
                    percent > 0
                      ? palette.widgets.green[500]
                      : palette.widgets.red[500],
                }}
              >
                {percent > 0 && "+"}
                {percent}%
              </Typography>
            }
          /> */}
        </Stack>
        <Typography
          sx={{
            whiteSpace: "nowrap",
          }}
          variant="subtitle3"
          fontWeight="300"
          fontSize="16px"
        >
          {title}
        </Typography>
      </Box>
    </Card>
  );
}
