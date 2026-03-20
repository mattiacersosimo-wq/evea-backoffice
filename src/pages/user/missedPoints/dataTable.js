// @mui
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
} from "@mui/material";

// components
import Scrollbar from "src/components/Scrollbar";

const DataTable = () => {
  return (
    <>
      <Card sx={{ mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>From User</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>PV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Shibi@bpract</TableCell>
                  <TableCell>20 Sep 2022 - 09:03pm</TableCell>
                  <TableCell>454s</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </>
  );
};

export default DataTable;
