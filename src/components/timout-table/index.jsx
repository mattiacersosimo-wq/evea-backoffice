import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EmptyTable from "../emptyTable";
import Loop from "../loop";
import Translate from "../translate";

const TimeOutTable = ({
  children,
  length,
  isTimedOut,
  headers,
  tableProps = {},
}) => {
  if (isTimedOut) return <EmptyTable />;
  if (length === 0)
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <Table {...tableProps}>
      <TableHead>
        <TableRow>
          <Loop
            list={headers}
            render={(item) => (
              <TableCell>
                <Translate>{item}</Translate>
              </TableCell>
            )}
          />
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
};

export const TimeOutList = ({ children, length, isTimedOut }) => {
  if (isTimedOut) return <EmptyTable />;
  if (length === 0)
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  return <>{children}</>;
};

export default TimeOutTable;
