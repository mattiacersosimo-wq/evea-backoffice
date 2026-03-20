const TYPES = {
    token: "btaf_token",
    bitcoin: "bitaps",
    coin: "coinpayment",
    wallet: "deposit_wallet",
    finPay: "finpay",
    paypal: "paypal",
    paypalBTaf: "paypal2",
    hundredPercentage: "coupon_100_percent",
    stripe: "stripe",
};

export const TYPE_IDS = {
    stripe: 1,
    paypal: 2,
    finPay: 3,
    wallet: 4,
    coin: 5,
    bitaps: 6,
    hundredPercentage: 8,
    bankPayment: 9,
    cod: 10,
};

export const PAYOUT_TYPE_IDS = {
    crypto: 1,
    manual: 2,
    stipe: 3,
};

export default TYPES;
