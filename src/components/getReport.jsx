import { LoadingButton } from "@mui/lab";
import { Box, useMediaQuery } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Translate from "./translate";

const GetReport = ({ size }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };

  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Box sx={{ justifyContent: "center" }}>
      <LoadingButton
        {...buttonProps}
        type="submit"
        variant="contained"
        size={size}
        loading={isSubmitting}
        name="get-report"
      >
        <Translate>report.get_report</Translate>
      </LoadingButton>
    </Box>
  );
};

export default GetReport;
