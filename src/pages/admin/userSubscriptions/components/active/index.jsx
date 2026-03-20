import {
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

import _data from "./_data";

const Active = () => {
  const columns = [
    "adminUserSubscriptions.product",
    "adminUserSubscriptions.totalActive ",
    "adminUserSubscriptions.1month",
    "adminUserSubscriptions.3month",
    "adminUserSubscriptions.6month",
    "adminUserSubscriptions.12month",
  ];

  const [limit, setLimit] = useState(10);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Typography sx={{ p: 1, mb: 3 }} variant="subtitle2">
          {"adminUserSubscriptions.totalActiveSubscriptions"}
        </Typography>
        <TableContainer style={{ maxHeight: "78vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell>{capitalCase(column)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
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
                    oneMonth,
                    product,
                    sixMonth,
                    threeMonth,
                    totalCount,
                    twelveMonth,
                  }) => {
                    return (
                      <TableRow hover key={id}>
                        <TableCell>{product}</TableCell>
                        <TableCell>{totalCount}</TableCell>
                        <TableCell>{oneMonth}</TableCell>
                        <TableCell>{threeMonth}</TableCell>
                        <TableCell>{sixMonth}</TableCell>
                        <TableCell>{twelveMonth}</TableCell>
                      </TableRow>
                    );
                  }
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Paper sx={{ textAlign: "right", padding: "0.3rem 3rem" }}>
          <Button onClick={() => setLimit(limit + 10)} name="read-more">
            {" "}
            {"adminUserSubscriptions.readMore"}
          </Button>
        </Paper>
      </Card>
    </>
  );
};

export default Active;
