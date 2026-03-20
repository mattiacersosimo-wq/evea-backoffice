import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const DataList = ({ prioritys, handleOpenMenu, rowNumber, disableAction }) => {
  const { id, name, description, active, color } = prioritys;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
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
      <TableCell>{active === 1 ? "Active" : null}</TableCell>
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
