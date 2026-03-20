import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const DataList = ({ department, rowNumber, handleOpenMenu, disableAction }) => {
  const { id, name, description, active } = department;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{active ? "Yes" : "No"}</TableCell>
      <TableCell>{description}</TableCell>
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
