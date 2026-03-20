import { TableCell, TableRow } from "@mui/material";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";

const DataList = ({ builder, rowNumber }) => {
  const { id } = builder;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{builder?.user?.username}</TableCell>
      <TableCell>{builder?.user?.email}</TableCell>
      <TableCell>
        <Currency>{builder?.amount}</Currency>
      </TableCell>
      <TableCell>
        <ParseDate date={builder?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
