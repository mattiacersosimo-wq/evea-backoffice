import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import ImpersonationBanner from "src/components/impersonationBanner";
import useCollapseDrawer from "src/hooks/useCollapseDrawer";
import {
  DashboardHeader,
  HorizontalWrapper,
  MainStyle,
  NavbarVertical,
} from "../shared";

const Horizontal = ({ navConfig }) => {
  const { collapseClick, isCollapse } = useCollapseDrawer();
  const [open, setOpen] = useState(false);

  return (
    <HorizontalWrapper>
      <DashboardHeader
        isCollapse={isCollapse}
        onOpenSidebar={() => setOpen(true)}
      />

      <NavbarVertical
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        config={navConfig}
      />

      <MainStyle collapseClick={collapseClick}>
        <Suspense fallback={<>loading...</>}>
          <ImpersonationBanner />
          <Outlet />
        </Suspense>
      </MainStyle>
    </HorizontalWrapper>
  );
};

export default Horizontal;
