import { Box, Card, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const Cards = ({ title, color, total, icon }) => {
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">
          <Translate>{title}</Translate>
        </Typography>
        <Typography variant="h4" style={{ whiteSpace: "pre" }}>
          <Currency>{total}</Currency>
        </Typography>
      </Box>

      <Box>
        <Iconify color={color} width={60} height={60} icon={icon} />
      </Box>
    </Card>
  );
};

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default Cards;
