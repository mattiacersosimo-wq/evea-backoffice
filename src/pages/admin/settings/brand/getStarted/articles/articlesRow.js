import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const articlesRow =
  (handleOpenMenu, rowStart) =>
  ({ id, menu_name, section_name, sort_order, ...rest }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + rowStart}</TableCell>
        <TableCell>{rest.brand_get_started_section.name}</TableCell>
        <TableCell>{menu_name}</TableCell>
        <TableCell>{sort_order ?? "--"}</TableCell>

        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more-button">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default articlesRow;
