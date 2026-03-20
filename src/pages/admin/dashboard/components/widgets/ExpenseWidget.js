import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";

ExpenseWidget.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function ExpenseWidget({ title }) {
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center">
          <Chip
            label="+ 3.2 %"
            size="small"
            sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.16) }}
          />

          <Iconify
            width={16}
            height={16}
            icon="eva:trending-up-fill"
            color="error.main"
          />
        </Stack>
        <Typography
          variant="body2"
          noWrap
          sx={{ mt: 1, color: "text.secondary" }}
        >
          then last month
        </Typography>

        <Typography variant="h4" gutterBottom>
          $ 15,678.00
        </Typography>
        <Typography
          variant="subtitle2"
          paragraph
          sx={{ color: "text.secondary" }}
        >
          {title}
        </Typography>
      </Box>
    </Card>
  );
}
