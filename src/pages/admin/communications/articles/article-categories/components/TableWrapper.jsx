import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";

const TableWrapper = ({ children, isEmpty }) => {
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 720 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{"adminCommunication.articile.no"}</TableCell>
              <TableCell>
                {"adminCommunication.articile.categoryName"}
              </TableCell>
              <TableCell>{"adminCommunication.articile.createdAt"}</TableCell>
              <TableCell>{"adminCommunication.articile.action"}</TableCell>
            </TableRow>
          </TableHead>
          {isEmpty ? (
            <BodyRow>
              <TableCell colSpan={7} align="center">
                <EmptyTable title="No Data Available" />
              </TableCell>
            </BodyRow>
          ) : (
            <TableBody>{children}</TableBody>
          )}
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};

export default TableWrapper;
