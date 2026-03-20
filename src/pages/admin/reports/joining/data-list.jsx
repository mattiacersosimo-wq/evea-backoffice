import { TableCell, TableRow } from "@mui/material";
import ParseDate from "src/components/date";

const DataList = ({ joining, rowNumber }) => {
  const { id, username, email, created_at, sponsor } = joining;
  return (
    <TableRow key={id}>
      <TableCell component="th" scope="row">
        {rowNumber}
      </TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{sponsor?.user?.username}</TableCell>
      <TableCell>
        {" "}
        <ParseDate date={created_at} />
      </TableCell>
    </TableRow>
  );
};

export default DataList;
