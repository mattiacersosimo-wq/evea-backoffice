import { Box, Card, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

Cards.propTypes = {
  chartColor: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.number).isRequired,
  percent: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default function Cards({ title, color, total, icon }) {
  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">
            <Translate>{title}</Translate>
          </Typography>

          <Typography variant="h4">
            <Currency>{total}</Currency>
          </Typography>
        </Box>

        <Box>
          <Iconify color={color} width={60} height={60} icon={icon} />
        </Box>
      </Card>
    </Grid>
  );
}
