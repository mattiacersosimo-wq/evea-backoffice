import { createContext, useContext } from "react";
import useTreeProvider from "./useTreeProvider";

export const treeInfoContext = createContext({
  username: "",
  userInfo: {},
  handleUsernameChange: () => null,
});

export const useTreeContext = () => useContext(treeInfoContext);

export const TreeProvider = ({ children }) => {
  const { handleUsernameChange, userInfo, username } = useTreeProvider();

  return (
    <treeInfoContext.Provider
      value={{ handleUsernameChange, username, userInfo }}
    >
      {children}
    </treeInfoContext.Provider>
  );
};
