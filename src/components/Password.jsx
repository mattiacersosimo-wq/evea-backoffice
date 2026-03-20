import { IconButton, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/Iconify";

const Password = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <RHFTextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Iconify
                icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

Password.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Password;
