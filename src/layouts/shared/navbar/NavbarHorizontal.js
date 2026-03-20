import { Container } from "@mui/material";
import { memo } from "react";
import { NavSectionHorizontal } from "src/components/nav-section";
import NavbarHorizontalStyle from "./navbarHorizontalStyle";

function NavbarHorizontal({ config }) {
  return (
    <NavbarHorizontalStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={config} />
      </Container>
    </NavbarHorizontalStyle>
  );
}

export default memo(NavbarHorizontal);
