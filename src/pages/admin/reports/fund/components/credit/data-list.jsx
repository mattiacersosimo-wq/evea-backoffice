import { TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";
const DataList = ({ credit, rowNumber }) => {
  const { id } = credit;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell align="left">{credit?.user?.username}</TableCell>
      <TableCell align="left">{credit?.user?.email}</TableCell>
      <TableCell align="left">
        <Currency>{credit?.total_amount}</Currency>
      </TableCell>
      <TableCell align="left">{capitalCase(credit?.wallet_type)}</TableCell>
      <TableCell align="left">{credit?.note}</TableCell>
      <TableCell align="left">
        <ParseDate date={credit?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
