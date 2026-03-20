import React from "react";
// @mui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { paramCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import Scrollbar from "src/components/Scrollbar";

import { PATH_DASHBOARD } from "src/routes/paths";

const PurchasedHistroy = () => {
  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{"adminStatistics.no"}</TableCell>
                <TableCell>{"adminStatistics.startDate"} </TableCell>
                <TableCell>{"adminStatistics.endDate"} </TableCell>
                <TableCell>{"adminStatistics.duration"} </TableCell>
                <TableCell>{"adminStatistics.status"} </TableCell>
                <TableCell>{"adminStatistics.price"} </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>{"adminStatistics.longTermTrade"}</TableCell>
                <TableCell>20</TableCell>
                <TableCell>25</TableCell>
                <TableCell>15398</TableCell>
                <TableCell>22</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>{"adminStatistics.movesTermTrade"}</TableCell>
                <TableCell>20</TableCell>
                <TableCell>25</TableCell>
                <TableCell>15398</TableCell>
                <TableCell>89</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>starter pack</TableCell>
                <TableCell>20</TableCell>
                <TableCell>25</TableCell>
                <TableCell>15398</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default PurchasedHistroy;
