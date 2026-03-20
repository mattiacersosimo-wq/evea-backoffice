import { Box, Typography } from "@mui/material";
import React from "react";
import ParseDate from "src/components/date";

import Translate from "src/components/translate";
import { useSubscriptionContext } from "../../../store/subscription";

const DateRange = () => {
  const data = useSubscriptionContext();

  const { created_at, effective_until } = data;
  return (
    <Typography variant="body2" fontWeight="light">
      <Box>
        <Translate>user.subscriptions.purchase_date</Translate>
        <span>
          &nbsp;
          <ParseDate date={created_at} />
        </span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Translate>user.subscriptions.expiry_date</Translate>
        <span>
          &nbsp;
          <ParseDate date={effective_until} />
        </span>
      </Box>
    </Typography>
  );
};

export default DateRange;
