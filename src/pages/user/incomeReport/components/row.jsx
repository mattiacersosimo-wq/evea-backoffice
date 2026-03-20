import { TableCell, TableRow } from "@mui/material";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";

const Row = ({ income, rowNumber }) => {
  const { id, fromuser, payment_type, total_amount, created_at } = income;
  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{fromuser.username}</TableCell>
      <TableCell>{payment_type}</TableCell>
      <TableCell>
        <Currency>{total_amount}</Currency>
      </TableCell>
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>
    </TableRow>
  );
};

export default Row;
