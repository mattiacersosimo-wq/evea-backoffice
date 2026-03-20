import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Scrollbar from "src/components/Scrollbar";

const CouponHistory = () => {
  return (
    <div>
      <Typography variant="subtitle2" p={2}>
        {"adminStore.coupons.couponAppliedHistory"}
      </Typography>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{"adminStore.coupons.no"}</TableCell>
                <TableCell>{"adminStore.coupons.couponCode"}</TableCell>
                <TableCell>{"adminStore.coupons.userName"}</TableCell>
                <TableCell>{"adminStore.coupons.email"} </TableCell>
                <TableCell>{"adminStore.coupons.product"} </TableCell>
                <TableCell>{"adminStore.coupons.period"}</TableCell>
                <TableCell>{"adminStore.coupons.amount"}</TableCell>
                <TableCell>{"adminStore.coupons.paidAmount"}</TableCell>
                <TableCell>{"adminStore.coupons.discount"}</TableCell>
                <TableCell>{"adminStore.coupons.date"}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default CouponHistory;
