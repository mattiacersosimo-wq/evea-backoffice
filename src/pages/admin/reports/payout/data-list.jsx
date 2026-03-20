import { TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import ParseDate from "src/components/date";
import { Currency } from "src/components/with-prefix";

const DataList = ({ payout, rowNumber }) => {
  const { id, row } = payout;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{payout?.user?.username}</TableCell>
      <TableCell>
        {payout?.user_profile?.first_name} {payout?.user_profile?.last_name}
      </TableCell>
      <TableCell>{capitalCase(payout?.status)}</TableCell>
      <TableCell>{payout?.user_coin_address?.address}</TableCell>
      <TableCell>
        <Currency>{payout?.amount}</Currency>
      </TableCell>
      <TableCell>
        <Currency>{payout?.admin_fee_deducted}</Currency>
      </TableCell>
      <TableCell>
        <Currency>{payout?.released_amount}</Currency>
      </TableCell>
      <TableCell>{payout?.available_coin.name}</TableCell>
      <TableCell>
        <ParseDate date={payout?.created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
