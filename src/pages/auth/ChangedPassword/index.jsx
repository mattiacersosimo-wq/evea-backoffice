import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { AuthWraper } from "../ResetPassword";

import Done from "src/images/check-mark.png";

const ChangedPassword = () => {
  return (
    <AuthWraper>
      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 5 }}>
        <Typography component="p" sx={{ mb: 3 }}>
          <img src={Done} />
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
          Password Changed !
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Your password has been changed successfully.. Please log in with the
          new password
        </Typography>
        <Button
          component={Link}
          to="/auth/login"
          sx={{
            p: 1.5,
          }}
          variant="contained"
          fullWidth
          size="lg"
        >
          Login
        </Button>
      </Box>
    </AuthWraper>
  );
};

export default ChangedPassword;
