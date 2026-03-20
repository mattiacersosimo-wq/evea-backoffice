import { Card } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PermanentSidebar } from "./components/MailSideBar/permanentSidebar";
import SideBarProvider from "./components/SideBarProvider";

const Mail = () => {
  return (
    <SideBarProvider>
      <Card sx={{ height: { md: "72vh" }, display: { md: "flex" } }}>
        <PermanentSidebar />
        <Outlet />
      </Card>
    </SideBarProvider>
  );
};

export default Mail;
