import { TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import ParseDate from "src/components/date";

const DataList = ({ point, rowNumber }) => {
  const { id } = point;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{point?.user?.username}</TableCell>
      <TableCell>{point?.leg}</TableCell>
      <TableCell>{point?.pv}</TableCell>
      <TableCell>
        <ParseDate date={point?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
