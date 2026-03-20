import React from "react";
// @mui
import {
  Link,
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

const Nothing = () => {
  // const linkTo = PATH_DASHBOARD.blog.view(paramCase());
  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{"adminStatistics.no"}</TableCell>
                <TableCell>{"adminStatistics.userName"} </TableCell>
                <TableCell>{"adminStatistics.email"} </TableCell>
                <TableCell>{"adminStatistics.mobile"} </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
                  shibi
                  {/* </Link> */}
                </TableCell>
                <TableCell>shibintr@bparct.com</TableCell>
                <TableCell>+91 8943 806 124</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>
                  {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
                  akshay
                  {/* </Link> */}
                </TableCell>
                <TableCell>shibintr@bparct.com</TableCell>
                <TableCell>+91 8943 806 124</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>
                  {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
                  rajesh
                  {/* </Link> */}
                </TableCell>
                <TableCell>shibintr@bparct.com</TableCell>
                <TableCell>+91 8943 806 124</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default Nothing;
