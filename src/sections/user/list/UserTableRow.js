import {
  Avatar,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  handleOpenMenu: PropTypes.func,
};

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  handleOpenMenu,
}) {
  const { name, avatarUrl, payment, orderDate, price, recurring } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{payment}</TableCell>

      <TableCell align="left" sx={{ textTransform: "capitalize" }}>
        {orderDate}
      </TableCell>

      <TableCell align="center">{price}</TableCell>

      <TableCell align="center">{recurring}</TableCell>

      <TableCell align="right">
        <IconButton onClick={handleOpenMenu}>
          <Iconify
            icon={"eva:more-vertical-fill"}
            width={20}
            height={20}
            name="more-button"
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
