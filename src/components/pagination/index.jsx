import { Box, Pagination, useMediaQuery } from "@mui/material";
import Ternary from "../ternary";

const PaginationButtons = (props) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  return (
    <Ternary
      when={props.count > 0}
      then={
        <Box
          sx={{
            marginTop: "2rem",
            float: "right",
          }}
        >
          <Pagination
            {...buttonProps}
            {...props}
            variant="outlined"
            color="primary"
          />
        </Box>
      }
    />
  );
};

export default PaginationButtons;
