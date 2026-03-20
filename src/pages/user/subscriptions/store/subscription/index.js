import { createContext, useContext } from "react";

const SubscriptionContext = createContext();

const SubscriptionProvider = ({ children, data }) => {
  return (
    <SubscriptionContext.Provider value={data}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => useContext(SubscriptionContext);

export default SubscriptionProvider;
