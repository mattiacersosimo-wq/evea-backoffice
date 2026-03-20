import { Button } from "@mui/material";
import React from "react";
import adminNavConfig from "src/nav-config/admin";
import userNavConfig from "src/nav-config/user";
import exportData from "./utils/export-data";
import generateMenus from "./utils/generate-menus";

const MenuBuilder = () => {
  const exportAdmin = () => {
    const generatedMenu = generateMenus(adminNavConfig);
    exportData(generatedMenu, "admin");
  };

  const exportUser = () => {
    const generatedMenu = generateMenus(userNavConfig);
    exportData(generatedMenu, "user");
  };

  return (
    <>
      <h2>MenuBuilder</h2>

      <Button onClick={exportAdmin}>export admin</Button>
      <Button onClick={exportUser}>export user</Button>
    </>
  );
};

export default MenuBuilder;
