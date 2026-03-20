import { createContext, useContext, useState } from "react";
import { CURRENCY } from "src/config";

const currencyContext = createContext({
  code: CURRENCY,
  list: [],
});

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const selected = localStorage.getItem("currency");
    if (selected) {
      return {
        code: selected,
        list: [],
      };
    }
    return {
      code: CURRENCY,
      list: [],
    };
  });

  return (
    <currencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </currencyContext.Provider>
  );
};

export const useCurrency = () => useContext(currencyContext);

export default CurrencyProvider;
