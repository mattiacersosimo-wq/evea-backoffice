import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import Iconify from "src/components/Iconify";

const cannedRow =
  (handleOpenMenu, row) =>
  ({ id, title, subject }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + row}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{subject}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default cannedRow;
