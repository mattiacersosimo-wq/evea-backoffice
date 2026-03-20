import { useState } from "react";
import { Outlet } from "react-router-dom";
import ImpersonationBanner from "src/components/impersonationBanner";
import useResponsive from "src/hooks/useResponsive";
import {
  DashboardHeader,
  NavbarHorizontal,
  NavbarVertical,
  VerticalWrapper,
} from "../shared";

const Vertical = ({ navConfig }) => {
  const isDesktop = useResponsive("up", "lg");

  const [open, setOpen] = useState(false);

  return (
    <>
      <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout />

      {isDesktop ? (
        <NavbarHorizontal config={navConfig} />
      ) : (
        <NavbarVertical
          isOpenSidebar={open}
          onCloseSidebar={() => setOpen(false)}
          config={navConfig}
        />
      )}

      <VerticalWrapper>
        <Outlet />
      </VerticalWrapper>
    </>
  );
};

export default Vertical;
