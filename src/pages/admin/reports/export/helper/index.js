import forBuilder from "./for-builder";
import topEarners from "./top-earners";
import forSales from "./for-sales";
import forPayout from "./for-payout";
import forIncome from "./for-income";
import forJoining from "./for-joining";
import forPoint from "./for-point";
import forCredit from "./for-credit";
import forDebit from "./for-debit";

const helper = (type) => {
  switch (type) {
    case "builder": {
      return forBuilder;
    }
    case "earners": {
      return topEarners;
    }
    case "sales": {
      return forSales;
    }
    case "payout": {
      return forPayout;
    }
    case "income": {
      return forIncome;
    }
    case "joining": {
      return forJoining;
    }
    case "point": {
      return forPoint;
    }
    case "credit": {
      return forCredit;
    }
    case "debit": {
      return forDebit;
    }
  }
};

export default helper;
