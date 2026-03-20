import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const DataList = ({ canned, handleOpenMenu, rowNumber, disableAction }) => {
  const { id, title, subject } = canned;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{subject}</TableCell>
      <TableCell>
        <IconButton
          disabled={disableAction}
          onClick={handleOpenMenu(id)}
          name="more"
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
