import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
const DataList = ({
  documents,
  handleOpenMenu,
  rowNumber,
  disabledActions,
}) => {
  const { id, title, doc_url, sort_order, created_at } = documents;
  return (
    <>
      <TableRow key={id}>
        <TableCell>{rowNumber}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>{sort_order}</TableCell>
        <TableCell
        
          component="a"
          href={doc_url}
          target="_blank"
          sx={{
            textDecoration: "none",
          }}
        >
          PDF <Iconify icon={"carbon:download"} />
        </TableCell>
        <TableCell>
          <ParseDate date={created_at} />
        </TableCell>

        <TableCell>
          <IconButton
            disabled={disabledActions}
            onClick={handleOpenMenu(id)}
            name="more-button"
          >
            <Iconify
              icon={"eva:more-vertical-fill"}
              width={20}
              height={20}
              name="more-button"
            />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default DataList;
