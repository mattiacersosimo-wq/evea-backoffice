import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const getStartedListRow =
  (handleOpenMenu, rowStart) =>
  ({ id, url, title, description }, i) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + rowStart}</TableCell>
        <TableCell>{url}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu(id)} name="more-button">
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default getStartedListRow;
