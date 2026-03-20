import { Chip, Typography } from "@mui/material";
import { lowerCase } from "lodash";
import React from "react";
import { useSubscriptionContext } from "../../../store/subscription";
import getColor from "../utils/get-color";

const Name = () => {
  const data = useSubscriptionContext();

  const { purchase_product, active_status } = data;
  const { name } = purchase_product || {};
  return (
    <Typography variant="h4" fontWeight="bold">
      {name}
      <Chip
        sx={{
          cursor: "pointer",
          ml: 1,
        }}
        label={active_status}
        variant="outlined"
        size="small"
        color={getColor(lowerCase(active_status))}
      />
    </Typography>
  );
};

export default Name;
