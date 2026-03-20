import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import EmptyPage from "src/images/blog-demo-img.jpg";

const DataList = ({ blogList, handleOpenMenu, rowNumber, disableAction }) => {
  const { id, image_url, title, type, created_at, short_description } =
    blogList;

  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>
        <img
          width={100}
          src={image_url ?? EmptyPage}
          style={{ height: 100, width: 150 }}
        />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{short_description}</TableCell>
      {/* <TableCell>{Boolean(parseInt(type)) ? "Private" : "Public"}</TableCell> */}
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>
      <TableCell>
        <IconButton disabled={disableAction} onClick={handleOpenMenu(id)}>
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
