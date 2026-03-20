const URLS = {
  builder: "business-builder-report",
  fundCredit: "fund-credit-report",
  credit: "fund-credit-report",
  debit: "fund-debit-report",
  joining: "joining-report",
  income: "income-report",
  payout: "payout-report",
  point: "point-history-report",
  sales: "sales-report",
  earners: "top-earners-report",
  transaction: "",
};

export const getUrl = (url) => URLS[url];
