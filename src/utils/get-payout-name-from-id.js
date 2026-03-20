import { PAYOUT_TYPE_IDS } from "./types";

const getPayoutNameFromId = (id) => {
  switch (parseInt(id)) {
    case PAYOUT_TYPE_IDS.crypto: {
      return "Crypto Payout";
    }
    case PAYOUT_TYPE_IDS.manual: {
      return "Manual Bank Payout";
    }
    case PAYOUT_TYPE_IDS.stipe: {
      return "Stripe Payout";
    }
  }
};

export default getPayoutNameFromId;
