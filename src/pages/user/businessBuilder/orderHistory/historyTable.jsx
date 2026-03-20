import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { PATH_USER } from "src/routes/paths";
import _data from "./_data";

const HistoryTable = () => {
  return (
    <TableContainer variant={Card} sx={{ marginTop: "2rem" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Recurring Enabled</TableCell>
            <TableCell>View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_data.map(
            ({ id, orderDate, paymentStatus, recurring, totalPrice }) => (
              <TableRow
                key={id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {id}
                </TableCell>
                <TableCell>
                  {new Date(orderDate).toLocaleDateString("en-GB", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  })}
                </TableCell>
                <TableCell>{totalPrice}</TableCell>
                <TableCell>{paymentStatus}</TableCell>
                <TableCell>{recurring ? "Yes" : "No"}</TableCell>

                <TableCell>
                  <IconButton
                    component={Link}
                    to={PATH_USER.my_orders.view(
                      "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5"
                    )}
                    name="view"
                  >
                    <Iconify icon="carbon:view" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
