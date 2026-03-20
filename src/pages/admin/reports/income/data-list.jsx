import { TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";

const DataList = ({ income, rowNumber }) => {
  const { id } = income;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{income?.user?.username}</TableCell>
      <TableCell>{capitalCase(income?.payment_type)}</TableCell>
      <TableCell>
        <Currency>{income?.total_amount}</Currency>
      </TableCell>
      <TableCell>
        <ParseDate date={income?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
