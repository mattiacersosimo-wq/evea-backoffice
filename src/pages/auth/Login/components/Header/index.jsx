import { styled } from "@mui/material/styles";
import GetStartedTitle from "./GetStartedTitle";

const Wrapper = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  left: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "flex-end",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const Header = ({ login }) => (
  <Wrapper>
    <GetStartedTitle login={login} />
  </Wrapper>
);

export default Header;
