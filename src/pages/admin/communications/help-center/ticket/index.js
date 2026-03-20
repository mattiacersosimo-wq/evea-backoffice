import { Outlet } from "react-router";

import RouteWrapper from "./components/RouteWrapper";

const Index = () => {
  return (
    <>
      <RouteWrapper>
        <Outlet />
      </RouteWrapper>
    </>
  );
};

export default Index;
