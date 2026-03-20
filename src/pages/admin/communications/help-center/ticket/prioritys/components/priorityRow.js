import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const prioritiesRow =
  (handleOpenMenu, rowStart) =>
  ({ id, name, description, active, color }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + rowStart}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>
          <input
            style={{
              border: "none",
            }}
            disabled
            type="color"
            value={color}
          />
        </TableCell>
        <TableCell>{active === 1 ? "active" : null}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default prioritiesRow;
