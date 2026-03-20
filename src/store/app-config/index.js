import { createContext, useContext, useState } from "react";

const configContext = createContext({});

const AppConfig = ({ children }) => {
  const [config, setConfig] = useState({});

  return (
    <configContext.Provider value={{ config, setConfig }}>
      {children}
    </configContext.Provider>
  );
};

export const useAppConfig = () => useContext(configContext);

export default AppConfig;
