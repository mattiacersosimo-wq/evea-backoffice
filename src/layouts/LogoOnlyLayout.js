import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
// components
import Logo from "../components/logo";

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  paddingTop: `calc(${theme.spacing(3)} + env(safe-area-inset-top))`,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: 0,
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    paddingTop: `calc(${theme.spacing(5)} + env(safe-area-inset-top))`,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <Logo width={180} />
      </HeaderStyle>
      <Outlet />
    </>
  );
}
