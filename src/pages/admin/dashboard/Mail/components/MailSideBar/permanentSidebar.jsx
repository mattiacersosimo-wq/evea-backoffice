import { Drawer } from "@mui/material";
import { NAVBAR } from "src/config";
import useResponsive from "src/hooks/useResponsive";
import MailSideBar from "./mailSideBar";

export const PermanentSidebar = ({ labels }) => {
  const isDesktop = useResponsive("up", "md");

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: { width: NAVBAR.BASE_WIDTH, position: "relative" },
          }}
        >
          <MailSideBar labels={labels} />
        </Drawer>
      ) : null}
    </>
  );
};
