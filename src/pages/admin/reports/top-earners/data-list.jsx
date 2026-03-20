import { TableCell, TableRow } from "@mui/material";
import { Currency } from "src/components/with-prefix";

const DataList = ({ topearner, rowNumber }) => {
  const { id } = topearner;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{topearner?.user?.username}</TableCell>
      <TableCell>{topearner?.user?.email}</TableCell>
      <TableCell>
        <Currency>{topearner?.amount}</Currency>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
