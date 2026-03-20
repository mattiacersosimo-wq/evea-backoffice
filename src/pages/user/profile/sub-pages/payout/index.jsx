import CoinAddress from "src/components/coinAddress";
import { PAYOUT_TYPE_IDS } from "src/utils/types";
import BankAccount from "./components/bank-account";
import HidePayout from "./components/bank-account/hide-payout";
import Stripe from "./components/stripe";

const Payout = () => {
  return (
    <>
      <HidePayout payoutId={PAYOUT_TYPE_IDS.crypto}>
        <CoinAddress />
      </HidePayout>
      <HidePayout payoutId={PAYOUT_TYPE_IDS.manual}>
        <BankAccount />
      </HidePayout>

      <HidePayout payoutId={PAYOUT_TYPE_IDS.stipe}>
        <Stripe />
      </HidePayout>
    </>
  );
};

export default Payout;
