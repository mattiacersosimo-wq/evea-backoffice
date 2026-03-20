import { IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";

const memberRow =
  (handleOpenMenu, row) =>
  (
    {
      id,
      username,
      email,
      created_at,
      is_turn_on_email,
      active,
      email_verified_at,
      paid_active,
      rank
    },
    i
  ) => {
    return (
      <TableRow key={id}>
        <TableCell>{i + row}</TableCell>
        <TableCell>{username}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{rank.rank_name}</TableCell>
        <TableCell>{paid_active === 0 ? "no" : "yes"}</TableCell>

        <TableCell>
          {new Date(created_at).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell>
          <IconButton
            onClick={handleOpenMenu(
              id,
              !active,
              Boolean(is_turn_on_email),
              Boolean(email_verified_at)
            )}
            name="more-button"
          >
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

export default memberRow;
