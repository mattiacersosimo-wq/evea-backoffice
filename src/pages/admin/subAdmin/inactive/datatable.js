import React, { useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  useMediaQuery,
  TableHead,
  TableContainer,
  Link,
  MenuItem,
  Divider,
} from "@mui/material";

// components
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import { TableMoreMenu } from "../../../components/table";

const DataTable = () => {
  // 3dot Menu

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>User Name </TableCell>
                <TableCell>Email </TableCell>
                <TableCell>User Group </TableCell>
                <TableCell>Created </TableCell>
                <TableCell>Action</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>shibi-react-test </TableCell>
                <TableCell>shibiReactTest </TableCell>
                <TableCell> shibintr@bpract.com </TableCell>
                <TableCell>test-react </TableCell>
                <TableCell>27 May 2022</TableCell>
                <TableCell>
                  <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                      <>
                        <MenuItem
                          sx={{ color: "default.main" }}
                          onClick={() => {
                            alert("Impersonate");
                          }}
                        >
                          <Iconify icon={"ant-design:user-switch-outlined"} />
                          Impersonate
                        </MenuItem>
                        <MenuItem
                          sx={{ color: "default.main" }}
                          onClick={() => {
                            alert("Edit");
                          }}
                        >
                          <Iconify icon={"akar-icons:edit"} />
                          Edit
                        </MenuItem>
                        <MenuItem
                          sx={{ color: "default.main" }}
                          onClick={() => {
                            alert("Profile");
                          }}
                        >
                          <Iconify icon={"ant-design:user-outlined"} />
                          Profile
                        </MenuItem>
                        <MenuItem
                          sx={{ color: "warning.main" }}
                          onClick={() => {
                            alert("Block User");
                          }}
                        >
                          <Iconify icon={"akar-icons:block"} />
                          Block User
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          sx={{ color: "error.main" }}
                          onClick={() => {
                            alert("Delete");
                          }}
                        >
                          <Iconify icon={"eva:trash-2-outline"} />
                          Delete
                        </MenuItem>
                      </>
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default DataTable;
