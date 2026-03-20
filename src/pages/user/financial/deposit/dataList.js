// @mui
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
// utils

// components
import Scrollbar from "src/components/Scrollbar";

const DataList = () => {
  return (
    <>
      <Card sx={{ mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"userFinancial.depositWallet.no"}</TableCell>
                  <TableCell>
                    {"userFinancial.depositWallet.userName"}
                  </TableCell>
                  <TableCell>
                    {"userFinancial.depositWallet.paymentMethod"}
                  </TableCell>
                  <TableCell>
                    {"userFinancial.depositWallet.paymentType"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Shibi</TableCell>
                  <TableCell>Card</TableCell>
                  <TableCell>$ 5784</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </>
  );
};

export default DataList;
