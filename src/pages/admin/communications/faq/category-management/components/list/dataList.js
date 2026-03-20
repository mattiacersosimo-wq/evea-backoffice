import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const DataList = ({ category, handleOpenMenu, rowNumber, disableAction }) => {
  const { id, name, description } = category;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{name} </TableCell>
      <TableCell>{description} </TableCell>

      <TableCell>
        <IconButton
          onClick={handleOpenMenu(id)}
          name="more-button"
          disabled={disableAction}
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
