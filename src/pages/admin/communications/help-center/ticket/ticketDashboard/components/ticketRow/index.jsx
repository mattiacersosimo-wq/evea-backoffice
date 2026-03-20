import {
  IconButton,
  Link,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import Iconify from "src/components/Iconify";
import StatusButton from "./StatusButton";
import { capitalCase } from "change-case";
import ReactQuill from "react-quill";
import { Link as RoutLink } from "react-router-dom";
import { PATH_DASHBOARD } from "src/routes/paths";
const ticketRow = (handleToggle, handleOpenMenu, rowStart) => (ticket, i) => {
  const {
    id,
    subject,
    status,
    user_name,
    priority_name,
    department_name,
    created_at,
    ticket_number,
    support_ticket_departments,
    support_ticket_priorities,
    support_ticket_categories,
    user_id,
    content,
    description,
    ...rest
  } = ticket;
  return (
    <TableRow>
      <TableCell>{i + rowStart}</TableCell>
      <TableCell>
        <Link
          component={RoutLink}
          to={PATH_DASHBOARD.communication.viewTickets(id)}
        >
          {ticket_number}
        </Link>
      </TableCell>
      <TableCell>{rest.user.username}</TableCell>
      <TableCell>{new Date(created_at).toLocaleDateString("en-GB")}</TableCell>
      <TableCell>{subject}</TableCell>
      <TableCell>
        <StatusButton
          handleToggle={handleToggle(id)}
          selectedItem={capitalCase(status)}
        />
      </TableCell>
      <TableCell>
        <Typography style={{ color: support_ticket_priorities?.color }}>
          {support_ticket_priorities?.name}
        </Typography>
      </TableCell>
      <TableCell>{support_ticket_departments?.name}</TableCell>
      <TableCell>{support_ticket_categories?.name}</TableCell>
      <TableCell>
        <IconButton onClick={handleOpenMenu(id, user_id, subject)}>
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export default ticketRow;
