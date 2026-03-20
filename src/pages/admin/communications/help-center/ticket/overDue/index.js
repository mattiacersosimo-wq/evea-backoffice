import { Box } from "@mui/material";
import { createContext, useEffect, useState } from "react";
const UserContext = createContext("Unknown");

const Index = () => {
  const [userName, setUserName] = useState("Shibin TR");
  useEffect(() => {
    setTimeout(() => {
      setUserName("Shibi, Shibin TR");
    }, 5000);
  }, []);
  return (
    <>
      <UserContext.Provider value={userName}>
        <Box>Main content</Box>
      </UserContext.Provider>
    </>
  );
};

export default Index;
