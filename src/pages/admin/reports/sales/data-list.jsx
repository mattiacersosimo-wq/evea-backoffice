import { TableCell, TableRow } from "@mui/material";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";

const DataList = ({ sales, rowNumber }) => {
  const { id, row } = sales;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{sales?.user?.username}</TableCell>
      <TableCell>{sales?.user?.email}</TableCell>
      <TableCell>
        <Currency>{sales?.total_amount}</Currency>
      </TableCell>
      <TableCell>{sales.invoice_id}</TableCell>
      <TableCell>{sales?.payment_type?.name}</TableCell>
      <TableCell>
        <ParseDate date={sales?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
