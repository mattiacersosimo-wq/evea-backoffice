import { Box, Card, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const Cards = ({ title, total, color, icon }) => {
  return (
    <div>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">
            <Translate>{title}</Translate>
          </Typography>
          <Typography variant="h4">
            <Currency>{total}</Currency>
          </Typography>
        </Box>

        <Box>
          <Iconify width={60} height={60} icon={icon} color={color} />
        </Box>
      </Card>
    </div>
  );
};

export default Cards;
