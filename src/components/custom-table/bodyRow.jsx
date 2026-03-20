import { TableRow } from "@mui/material";
import React from "react";

const BodyRow = ({ children }) => (
  <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
    {children}
  </TableRow>
);

export default BodyRow;
