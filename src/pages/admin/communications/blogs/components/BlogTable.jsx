import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Scrollbar from "src/components/Scrollbar";

const BlogTable = ({ children }) => {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> {"adminCommunication.blog.no"} </TableCell>
              <TableCell>{"adminCommunication.blog.image"}</TableCell>
              <TableCell>{"adminCommunication.blog.blogTitle"}</TableCell>
              <TableCell>{"adminCommunication.blog.blogDescription"}</TableCell>
              <TableCell>{"adminCommunication.blog.scope"}</TableCell>
              <TableCell>{"adminCommunication.blog.blogDate"}</TableCell>
              <TableCell>{"adminCommunication.blog.action"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
    // </Scrollbar>
  );
};

export default BlogTable;
