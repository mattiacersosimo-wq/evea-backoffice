import React from "react";
import { useLocation } from "react-router";
import LeftAlignButton from "src/components/LeftAlignButton";
import { PATH_USER } from "src/routes/paths";

const NavButton = ({ to, ...rest }) => {
  const { pathname } = useLocation();
  const linkTo = PATH_USER.business_builder.materials.view(to);

  return (
    <LeftAlignButton
      {...rest}
      linkTo={linkTo}
      isActive={pathname.split("/").at(-1) === to}
    />
  );
};

export default NavButton;
