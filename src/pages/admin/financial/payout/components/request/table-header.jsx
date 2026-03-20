import { TableCell, TableHead, TableRow } from "@mui/material";

const TableHeaderRow = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>{"adminFinancial.payout.no"}</TableCell>
        <TableCell>{"adminFinancial.payout.userName"} </TableCell>
        <TableCell>{"adminFinancial.payout.userBalance"} </TableCell>
        <TableCell>{"adminFinancial.payout.walletAddress"} </TableCell>
        <TableCell>{"adminFinancial.payout.date"}</TableCell>
        <TableCell>{"adminFinancial.payout.requestedAmount"}</TableCell>
        <TableCell>{"adminFinancial.payout.adminFeeDeducted"}</TableCell>
        <TableCell>{"adminFinancial.payout.amountReleased"}</TableCell>
        <TableCell>{"adminFinancial.payout.action"}</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export default TableHeaderRow;
