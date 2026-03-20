import { TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";

const Row = ({
  handleUpdate,
  id,
  rank_name,
  pqv_required,
  tv_required,
  gv_required,
  user_type,
  min_pqv,
  config,
}) => {
  return (
    <TableRow>
      <TableCell>
        <TextField
          onChange={handleUpdate(id)}
          size="small"
          style={{ width: 150 }}
          value={rank_name}
          name="rank_name"
        />
      </TableCell>
      {config.package_id && (
        <TableCell>
          <TextField
            style={{ width: 100 }}
            onChange={handleUpdate(id)}
            value={pqv_required}
            name="pqv_required"
            size="small"
          />
        </TableCell>
      )}
      {(config.referral_count) && (
        <TableCell>
          <TextField
            style={{ width: 100 }}
            onChange={handleUpdate(id)}
            value={tv_required}
            name="tv_required"
            size="small"
          />
        </TableCell>
      )}
      {(config.team_volume) && (
        <TableCell>
          <TextField
            style={{ width: 100 }}
            onChange={handleUpdate(id)}
            value={gv_required}
            name="gv_required"
            size="small"
          />
        </TableCell>
      )}
      {/* {(config.team_volume) && (
        <TableCell>
          <TextField
            style={{ width: 100 }}
            onChange={handleUpdate(id)}
            value={user_type}
            name="user_type"
            size="small"
          />
        </TableCell>
      )}
      {(config.team_volume) && (
        <TableCell>
          <TextField
            style={{ width: 100 }}
            onChange={handleUpdate(id)}
            value={min_pqv}
            name="min_pqv"
            size="small"
          />
        </TableCell>
      )} */}
    </TableRow>
  );
};

export default Row;