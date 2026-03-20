import { Button } from "@mui/material";
import React, { useState } from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import { useSubscriptionContext } from "src/pages/user/recurringOrders/store/subscription";
import CancelRecurringConfirm from "../dialogs/disable-recurring";
import { useTranslation } from "react-i18next";

const DisableRecurring = ({ reload }) => {
  const { t } = useTranslation();
  const data = useSubscriptionContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { is_recurring, recurring_enabled_on } = data || {};

  return (
    <Ternary
      when={is_recurring === 1}
      then={
        <>
          <Button onClick={handleOpen} variant="outlined" size="small">
            {t("user.recurring_order.disable_recurring")}
          </Button>
          <Button startIcon={<Iconify icon="ic:baseline-sync" />} size="small">
            {t("user.recurring_order.recurring_enabled")}
          </Button>

          <Ternary
            when={Boolean(recurring_enabled_on)}
            then={
              <Button size="small">
                {t("user.recurring_order.enable_on")}:{" "}
                <ParseDate date={recurring_enabled_on} />
              </Button>
            }
          />

          <CancelRecurringConfirm
            open={open}
            onClose={handleClose}
            reload={reload}
          />
        </>
      }
    />
  );
};

export default DisableRecurring;
