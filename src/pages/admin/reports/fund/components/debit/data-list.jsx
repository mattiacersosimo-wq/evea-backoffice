import { TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";
const DataList = ({ debit, rowNumber }) => {
  const { id } = debit;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell align="left">{debit?.user?.username}</TableCell>
      <TableCell align="left">{debit?.user?.email}</TableCell>
      <TableCell align="left">
        <Currency>{debit?.total_amount}</Currency>
      </TableCell>
      <TableCell align="left">{capitalCase(debit?.wallet_type)}</TableCell>
      <TableCell align="left">{debit?.note}</TableCell>
      <TableCell align="left">
        <ParseDate date={debit?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
