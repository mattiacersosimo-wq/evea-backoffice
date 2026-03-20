import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { forwardRef } from "react";

import Scrollbar from "src/components/Scrollbar";

const TableWrapper = forwardRef(({ children, name }, ref) => {
  return (
    <Card sx={{ pt: 1 }}>
      <TableContainer>
        <Scrollbar>
          <Table name={name}>
            <TableHead>
              <TableRow>
                <TableCell>{"adminCommunication.helpCenter.no"}</TableCell>
                <TableCell>
                  {"adminCommunication.helpCenter.tktNumber"}
                </TableCell>
                <TableCell>{"adminCommunication.helpCenter.tktFrom"}</TableCell>
                <TableCell>{"adminCommunication.helpCenter.date"}</TableCell>
                <TableCell style={{ minWidth: "15rem" }}>
                  {"adminCommunication.helpCenter.subject"}
                </TableCell>
                <TableCell>{"adminCommunication.helpCenter.status"}</TableCell>
                <TableCell>
                  {"adminCommunication.helpCenter.priority"}
                </TableCell>
                <TableCell>
                  {"adminCommunication.helpCenter.department"}
                </TableCell>
                <TableCell>
                  {"adminCommunication.helpCenter.category"}
                </TableCell>
                <TableCell>{"adminCommunication.helpCenter.action"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
});
export default TableWrapper;
