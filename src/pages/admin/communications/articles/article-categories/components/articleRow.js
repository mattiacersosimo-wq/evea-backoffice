import { IconButton, TableCell, TableRow } from "@mui/material";

import Iconify from "src/components/Iconify";

const articleRow = (handleOpenMenu, rowStart) => (row, i) =>
  (
    <TableRow>
      <TableCell>{i + 1}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        {new Date(`${row.created_at}`).toLocaleDateString("en-GB")}
      </TableCell>
      <TableCell>
        <IconButton onClick={handleOpenMenu(row.id)} name="more-button">
          <Iconify
            icon={"eva:more-vertical-fill"}
            width={20}
            height={20}
            name="more-button"
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );

export default articleRow;
