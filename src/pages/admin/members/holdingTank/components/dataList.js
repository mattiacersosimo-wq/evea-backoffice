import { Button, Chip, IconButton, TableCell, TableRow } from "@mui/material";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const DataList = ({
  holdingtank,
  handleOpenMenu,
  handleClickOpen,
  rowNumber,
  status,
}) => {
  const {
    holding_tank,
    id,
    username,
    email,
    created_at,
    paid_active,
    user_profile,
    is_turn_on_email,
    active,
    block_type,
  } = holdingtank;
  const checkBlock = block_type === null;
  return (
    <>
      <TableRow key={id}>
        <TableCell>{rowNumber}</TableCell>
        <TableCell>
          {username}{" "}
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
        <TableCell>{paid_active === 0 ? "No" : "Yes"}</TableCell>
        <TableCell>
          <ParseDate date={created_at} />
        </TableCell>

        <TableCell>
          <Button
            disabled={!status.add}
            onClick={handleClickOpen(holding_tank.user_id)}
            size="small"
            name="binary"
            variant="contained"
            startIcon={<Iconify icon="fluent:add-12-filled" />}
          >
            <Translate>holding_tank.network</Translate>
          </Button>
        </TableCell>

        <TableCell>
          <IconButton
            onClick={handleOpenMenu(
              holding_tank.id,
              user_profile.user_id,
              Boolean(is_turn_on_email),
              active
            )}
            name="more-button"
          >
            <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default DataList;
