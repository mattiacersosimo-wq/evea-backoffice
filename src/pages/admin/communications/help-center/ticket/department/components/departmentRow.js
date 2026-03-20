import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const departmentRow =
  (handleOpenMenu, rowStart) =>
  ({ id, name, description, active }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + rowStart}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{active ? "Yes" : "No"}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default departmentRow;
