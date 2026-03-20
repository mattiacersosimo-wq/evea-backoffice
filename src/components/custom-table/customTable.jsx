import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { capitalCase } from "change-case";

const TableHeader = ({ headers }) => {
  return (
    <TableHead>
      <TableRow>
        {headers?.map((header, i) => (
          <TableCell>{capitalCase(header)}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const CustomTable = ({ headers, children }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHeader headers={headers} />
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
