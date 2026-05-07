import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { Currency } from "src/components/with-prefix";

const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };
const PODIUM_BG = {
  1: "rgba(255, 215, 0, 0.08)",
  2: "rgba(192, 192, 192, 0.08)",
  3: "rgba(205, 127, 50, 0.08)",
};

const DataList = ({ topearner, rowNumber }) => {
  const { id } = topearner;
  const medal = MEDALS[rowNumber];
  const bg = PODIUM_BG[rowNumber];
  return (
    <TableRow key={id} sx={bg ? { backgroundColor: bg } : {}}>
      <TableCell component="th" scope="row">
        {medal ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <span style={{ fontSize: "1.1rem" }}>{medal}</span>
            <Typography component="span" sx={{ fontWeight: 700 }}>{rowNumber}</Typography>
          </Box>
        ) : (
          rowNumber
        )}
      </TableCell>
      <TableCell sx={{ fontWeight: medal ? 700 : 400 }}>
        {topearner?.user?.username || "—"}
      </TableCell>
      <TableCell>{topearner?.user?.email || "—"}</TableCell>
      <TableCell sx={{ fontWeight: medal ? 700 : 400 }}>
        <Currency>{topearner?.amount}</Currency>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
