import {
  IconButton,
  Link,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { capitalCase } from "change-case";
import { Link as RoutLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import { PATH_DASHBOARD } from "src/routes/paths";
import StatusButton from "../ticketRow/StatusButton";

const DataList = ({
  showAdd,
  ticket,
  handleToggle,
  handleOpenMenu,
  rowNumber,
  disableAction,
  enableUpdateStatus,
}) => {
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
      <TableCell>{rowNumber}</TableCell>
      <TableCell>
        <Typography
          component={showAdd ? RoutLink : "p"}
          to={PATH_DASHBOARD.communication.viewTickets(id)}
        >
          {ticket_number}
        </Typography>
      </TableCell>
      <TableCell>{rest?.user?.username}</TableCell>
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>
      <TableCell>{subject}</TableCell>
      <TableCell>
        <StatusButton
          enableUpdateStatus={enableUpdateStatus}
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
        <IconButton
          disabled={disableAction}
          onClick={handleOpenMenu(id, user_id, subject)}
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export default DataList;
