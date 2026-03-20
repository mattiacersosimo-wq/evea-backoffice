import { Button, Link, TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import { Link as RouterLink, useParams } from "react-router-dom";
import ParseDate from "src/components/date";
import { PATH_USER } from "src/routes/paths";

const Row = ({ data }) => {
  const { label } = useParams();

  const linkTo = `${PATH_USER.helpCenter.createTicket.subCategory(label)}/${
    data.id
  }`;
  return (
    <TableRow
      key={data.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row">
        <Link to={linkTo} component={RouterLink} sx={{ cursor: "pointer" }}>
          {data?.ticket_number}
        </Link>
      </TableCell>
      <TableCell align="left">
        <ParseDate date={data?.created_at} />
      </TableCell>
      <TableCell align="left">{data?.subject}</TableCell>
      <TableCell align="left">{capitalCase(data?.status)}</TableCell>
      <TableCell
        align="left"
        style={{
          color: data?.support_ticket_priorities?.color,
        }}
      >
        {data?.support_ticket_priorities?.name}
      </TableCell>
      <TableCell align="left">
        {data?.support_ticket_departments?.name}
      </TableCell>
      <TableCell align="left">
        {data?.support_ticket_categories?.name}
      </TableCell>
      <TableCell align="left">
        <Button
          disableFocusRipple={false}
          size="small"
          component={RouterLink}
          to={linkTo}
          name="view"
        >
          view
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Row;
