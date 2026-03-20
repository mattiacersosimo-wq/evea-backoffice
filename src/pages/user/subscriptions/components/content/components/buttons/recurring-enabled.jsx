import { Button } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";

const RecurringEnabled = () => {
  const data = useSubscriptionContext();

  const { is_recurring } = data;

  return (
    <Ternary
      when={is_recurring !== 1}
      then={
        <>
          <Button
            startIcon={<Iconify icon="ic:baseline-sync-disabled" />}
            size="small"
          >
            Recurring Not Enabled
          </Button>
        </>
      }
    />
  );
};

export default RecurringEnabled;
