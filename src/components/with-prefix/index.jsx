import { useMemo } from "react";
import { useCurrency } from "src/store/currency";
import { TwoPrecisionRound } from "../helpers";

// currency obj ref site : https://www.eurochange.co.uk/travel/tips/world-currency-abbreviations-symbols-and-codes-travel-money

export const useSelectedCurrency = () => {
  const { currency } = useCurrency();
  const { code, list } = currency;

  const selected = useMemo(() => {
    return list.find(({ code: c }) => c === code);
  }, [code, list]);

  return selected;
};

export const useGetCurrencySymbol = () => {
  const selected = useSelectedCurrency();
  return selected?.symbol || "";
};

export const useGetExchangeRate = () => {
  const selected = useSelectedCurrency();
  return selected?.exchange_rate;
};
export const Currency = ({ children, style = {} }) => {
  const selected = useSelectedCurrency();

  return (
    <span style={{ whiteSpace: "nowrap", ...style }}>
      {selected?.symbol}
      <TwoPrecisionRound number={children * selected?.exchange_rate || 0} />
    </span>
  );
};
