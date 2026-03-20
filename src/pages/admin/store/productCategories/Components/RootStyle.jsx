import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
export default styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
}));
