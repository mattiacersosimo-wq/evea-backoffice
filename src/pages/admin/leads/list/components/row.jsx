import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

const Row = ({ openUpdate, data, rowNumber }) => {
  const { mobile, name, email, created_at } = data;

  return (
    <TableRow>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{mobile}</TableCell>
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>
      <TableCell>
        <IconButton onClick={openUpdate}>
          <Iconify icon="material-symbols:edit-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Row;
