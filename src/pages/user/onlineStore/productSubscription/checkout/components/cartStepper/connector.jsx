import { StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";

const Connector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  "& .MuiStepConnector-line": {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  "&.Mui-active, &.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default Connector;
