import { styled } from "@mui/material/styles";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export default RootStyle;
