import { LoadingButton } from "@mui/lab";
import React from "react";
import { useFormContext } from "react-hook-form";

import PropTypes from "prop-types";

const RHFLoadingButton = ({ children, ...rest }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <LoadingButton type="submit" loading={isSubmitting} {...rest}>
      {children}
    </LoadingButton>
  );
};

RHFLoadingButton.defaultProps = {
  variant: "contained",
};
RHFLoadingButton.propTypes = {
  //   onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  children: PropTypes.node,
};

export default RHFLoadingButton;
