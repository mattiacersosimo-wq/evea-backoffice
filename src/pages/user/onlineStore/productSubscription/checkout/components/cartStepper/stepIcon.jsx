import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";

const StepIcon = ({ active, completed }) => {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? "primary.main" : "text.disabled",
      }}
    >
      {completed ? (
        <Iconify
          icon={"eva:checkmark-fill"}
          sx={{ zIndex: 1, width: 20, height: 20, color: "primary.main" }}
        />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          }}
        />
      )}
    </Box>
  );
};

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

export default StepIcon;
