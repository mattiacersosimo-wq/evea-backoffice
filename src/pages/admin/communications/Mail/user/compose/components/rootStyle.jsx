import { styled } from "@mui/material/styles";

const RootStyle = styled("div")(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  outline: "none",
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  flexDirection: "column",
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

export default RootStyle;
