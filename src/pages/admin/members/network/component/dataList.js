import { Chip, IconButton, TableCell, TableRow, Button } from "@mui/material";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const formatUserType = (type) => {
  if (!type) return "";
  return type.replace(/_/g, " ");
};

const DataList = ({
  network,
  handleOpenMenu,
  rowNumber,
  onOpenChangeDates,
}) => {
  const {
    id,
    username,
    unique_id,
    email,
    created_at,
    is_turn_on_email,
    active,
    email_verified_at,
    paid_active,
    rank,
    user_type,
    engaged,
    is_smartship_customer,
    block_type,
  } = network;

  const checkBlock = block_type === null;

  return (
    <TableRow key={id}>
      <TableCell>{rowNumber}</TableCell>
      <TableCell>
        {username}
        <Ternary
          when={!Boolean(checkBlock)}
          then={
            <Chip
              label={
                <small>
                  <b>
                    <Translate>global.blocked</Translate>
                  </b>
                </small>
              }
              size="small"
              color="warning"
              variant="outlined"
              sx={{ marginLeft: 1 }}
            />
          }
        />
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{unique_id}</TableCell>
      <TableCell>{rank.rank_name}</TableCell>
      <TableCell>{formatUserType(user_type)}</TableCell>
      <TableCell>{is_smartship_customer === 0 ? "No" : "Yes"}</TableCell>
      <TableCell>{paid_active === 0 ? "No" : "Yes"}</TableCell>
      <TableCell>{engaged === true ? "Yes" : "No"}</TableCell>
      <TableCell>
        <ParseDate date={created_at} />
      </TableCell>

      <TableCell>
        <Button
          variant="contained"
          size="small"
          onClick={onOpenChangeDates(id)}
        >
          Change Dates
        </Button>
      </TableCell>

      <TableCell>
        <IconButton
          onClick={handleOpenMenu(
            id,
            !active,
            Boolean(is_turn_on_email),
            Boolean(email_verified_at),
          )}
          name="more-button"
        >
          <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DataList;
