import { Button } from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";
import FinPay from "../dialogs/fin-pay";
import EnablePaypal from "../dialogs/paypal-recurring";
import EnableStripe from "../dialogs/stripe";
import PaymentTypes from "../payment-types";

const EnableRecurring = ({ reload }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [openStripe, setOpenStripe] = useState(false);
  const [openFinPay, setOpenFinPay] = useState(false);
  const [openPaypal, setOpenPaypal] = useState(false);

  const handleOpenMenu = (e) => setOpenMenu(e.currentTarget);
  const handleCloseMenu = () => setOpenMenu(null);

  const handleOpenStripe = () => setOpenStripe(true);
  const handleCloseStripe = () => setOpenStripe(false);

  const handleOpenFinPay = () => setOpenFinPay(true);
  const handleCloseFinPay = () => setOpenFinPay(false);

  const handleOpenPayPal = () => setOpenPaypal(true);
  const handleClosePayPal = () => setOpenPaypal(false);

  const enableRecurring = (id) => () => {
    if (id === 1) {
      handleOpenStripe();
    } else if (id === 2) {
      handleOpenPayPal();
    } else if (id === 3) {
      handleOpenFinPay();
    }

    handleCloseMenu();
  };

  const data = useSubscriptionContext();

  const { is_recurring, recurring_cancelled_on } = data;

  return (
    <Ternary
      when={is_recurring !== 1}
      then={
        <>
          <Button onClick={handleOpenMenu} variant="outlined" size="small">
            <Translate>user.subscriptions.enable_recurring</Translate>
          </Button>
          <Button
            startIcon={<Iconify icon="ic:baseline-sync-disabled" />}
            size="small"
          >
            <Translate>user.subscriptions.recurring_not_enabled</Translate>
          </Button>
          <Ternary
            when={Boolean(recurring_cancelled_on)}
            then={
              <Button size="small">
                <Translate>user.subscriptions.recurring_cancelled_on</Translate>
                : <ParseDate date={recurring_cancelled_on} />
              </Button>
            }
          />

          <PaymentTypes
            anchorEl={openMenu}
            enableRecurring={enableRecurring}
            onClose={handleCloseMenu}
          />

          <EnableStripe
            onClose={handleCloseStripe}
            open={openStripe}
            reload={reload}
          />
          <FinPay
            onClose={handleCloseFinPay}
            open={openFinPay}
            reload={reload}
          />
          <EnablePaypal onClose={handleClosePayPal} open={openPaypal} />
        </>
      }
    />
  );
};

export default EnableRecurring;
