import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const categoryRow =
  (handleOpenMenu, row, item) =>
  ({ id, name, sort_order }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + row}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{sort_order}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more-button">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default categoryRow;
