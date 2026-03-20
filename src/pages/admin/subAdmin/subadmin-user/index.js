import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// routes
import { PATH_DASHBOARD } from "../../../routes/paths";

// mock
import { _appInvoices } from "../../../_mock";

// hooks
import useSettings from "../../../hooks/useSettings";

// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import Page from "../../../components/Page";
import Scrollbar from "../../../components/Scrollbar";
import { TableMoreMenu } from "../../../components/table";

const Index = () => {
  const { themeStretch } = useSettings();

  // 3dot Menu

  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <Page title="Sub Admin Users : Sub admins">
      <Box>
        <HeaderBreadcrumbs
          heading="Sub Admin Users"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Sub Admin Users" },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.subAdmin.add_user_group}
              variant="contained"
              startIcon={<Iconify icon={"eva:plus-fill"} />}
            >
              Add User Group
            </Button>
          }
        />
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell>Side bar URls </TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_appInvoices.slice(0, 1).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>1</TableCell>
                      <TableCell>shibiReactTest </TableCell>
                      <TableCell>
                        <ul>
                          <li>Dashboard</li>
                          <li>Home</li>
                          <li>Profile</li>
                        </ul>
                      </TableCell>
                      <TableCell>test-react </TableCell>
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
                                  alert("Edit");
                                }}
                              >
                                <Iconify icon={"akar-icons:edit"} />
                                Edit
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Box>
    </Page>
  );
};

export default Index;
