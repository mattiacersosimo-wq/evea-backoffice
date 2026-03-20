import { Input } from "@mui/material";
import { styled } from "@mui/material/styles";

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

export default InputStyle;
