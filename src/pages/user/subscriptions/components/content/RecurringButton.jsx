import { Box } from "@mui/material";
import { styled } from "@mui/system";

const RecurringButton = styled(Box)(({ theme }) => {
  return {
    width: "fit-content",
    padding: "4px",
    borderRadius: "10px",
    fontSize: "smaller",
    marginTop: "1rem",

    "& span": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      padding: "7px",
      fontWeight: "600",
    },
  };
});

export default RecurringButton;
