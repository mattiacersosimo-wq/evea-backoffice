import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
const DataList = ({ rowNumber, videos, handleOpenMenu, disabledActions }) => {
  const { id, title, video_url, created_at } = videos;
  return (
    <>
      <TableRow key={id}>
        <TableCell>{rowNumber}</TableCell>
        <TableCell>{title}</TableCell>
        <TableCell
          component="a"
          href={video_url}
          target="_blank"
          sx={{
            textDecoration: "none",
          }}
        >
          <Iconify icon={"carbon:view-filled"} />
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
