import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const categoriesRow =
  (handleOpenMenu, row) =>
  ({ id, name, description, active }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + row}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{Boolean(active) ? "Yes" : "No"}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default categoriesRow;
