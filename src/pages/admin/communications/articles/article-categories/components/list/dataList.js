import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

const DataList = ({ category, handleOpenMenu, rowNumber, disabledActions }) => {
  const { id, name, created_at } = category;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>
      <TableCell>
        <IconButton
          disabled={disabledActions}
          onClick={handleOpenMenu(id)}
          name="more-button"
        >
          <Iconify
            icon={"eva:more-vertical-fill"}
            width={20}
            height={20}
            name="more-button"
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
