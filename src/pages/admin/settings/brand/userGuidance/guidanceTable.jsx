import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import Scrollbar from "src/components/Scrollbar";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";

import getStartedListRow from "./getStartedListRow";
import Translate from "src/components/translate";

const GuidanceTable = ({ dataList = [], handleOpenMenu, rowStart }) => {
  const isEmpty = !Boolean(dataList?.length);
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 720 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate> {"settings.brand.no"} </Translate>
              </TableCell>
              <TableCell> URL</TableCell>
              <TableCell>
                {" "}
                <Translate>{"settings.brand.blogTitle"}</Translate>
              </TableCell>
              <TableCell>
                {" "}
                <Translate>{"settings.brand.description"}</Translate>
              </TableCell>
              <TableCell>
                {" "}
                <Translate>{"settings.brand.action"}</Translate>{" "}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          {isEmpty ? (
            <BodyRow>
              <TableCell colSpan={7} align="center">
                <EmptyTable title="No Data Available" />
              </TableCell>
            </BodyRow>
          ) : (
            <TableBody>
              {dataList.map(getStartedListRow(handleOpenMenu, rowStart))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};
export default GuidanceTable;
