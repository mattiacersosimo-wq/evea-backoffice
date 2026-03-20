import React, { createContext, useContext, useState } from "react";
import PageWrapper from "./PageWrapper";

const sideBarContext = createContext({
  open: false,
  onOpen: () => null,
  onClose: () => null,
});

export const useSidebarContext = () => useContext(sideBarContext);

const SideBarProvider = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <sideBarContext.Provider
      value={{
        open: openSidebar,
        onClose: () => setOpenSidebar(false),
        onOpen: () => setOpenSidebar(true),
      }}
    >
      <PageWrapper>{children}</PageWrapper>
    </sideBarContext.Provider>
  );
};

export default SideBarProvider;
