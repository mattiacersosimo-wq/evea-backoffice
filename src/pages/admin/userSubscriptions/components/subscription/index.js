import {
  Box,
  Button,
  Card,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import { BodyRow } from "src/components/custom-table";
import EmptyTable from "src/components/emptyTable";

import _data from "./_data";

const Active = () => {
  const columns = [
    "adminUserSubscriptions.no",
    "adminUserSubscriptions.product",
    "adminUserSubscriptions.name",
    "adminUserSubscriptions.userNamee",
    "adminUserSubscriptions.emaill",
    "adminUserSubscriptions.purchasedDate",
    "adminUserSubscriptions.adminAssigned",
    "adminUserSubscriptions.expireOn",
    "adminUserSubscriptions.recurringEnabled",
    "adminUserSubscriptions.telegramUsername",
    "adminUserSubscriptions.canceledDate",
    "adminUserSubscriptions.reason",
    "adminUserSubscriptions.action",
  ];
  const [limit, setLimit] = useState(10);

  const isEmpty = !Boolean(_data?.length);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Box textAlign="right" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={"fluent:delete-28-regular"} />}
            sx={{ m: 1 }}
            name="resolved"
          >
            {"adminUserSubscriptions.resolved"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={"ri:file-excel-2-line"} />}
            sx={{ m: 1 }}
            name="excel"
          >
            {"adminUserSubscriptions.excel"}
          </Button>
        </Box>

        <TableContainer style={{ maxHeight: "78vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell>{capitalCase(column)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isEmpty ? (
              <BodyRow>
                <TableCell colSpan={7} align="center">
                  <EmptyTable title="No Data Available" />
                </TableCell>
              </BodyRow>
            ) : (
              <TableBody
                sx={{
                  p: 3,
                  maxHeight: 306,
                  overflow: "scroll",
                }}
              >
                {_data
                  .slice(0, limit)
                  .map(
                    ({
                      id,
                      product,
                      name,
                      username,
                      email,
                      purchaseDate,
                      adminAssigned,
                      ExpireOn,
                      RecurringEnabled,
                      TelegramUsername,
                      CanceledDate,
                      reason,
                    }) => {
                      return (
                        <TableRow hover key={id}>
                          <TableCell>{id}</TableCell>
                          <TableCell>{product}</TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell>{username}</TableCell>
                          <TableCell>{email}</TableCell>
                          <TableCell>{purchaseDate}</TableCell>
                          <TableCell>{adminAssigned}</TableCell>
                          <TableCell>{ExpireOn}</TableCell>
                          <TableCell>{RecurringEnabled}</TableCell>
                          <TableCell>{TelegramUsername}</TableCell>
                          <TableCell>{CanceledDate}</TableCell>
                          <TableCell>{reason}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              name="manage"
                            >
                              {"adminUserSubscriptions.manage"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default Active;
