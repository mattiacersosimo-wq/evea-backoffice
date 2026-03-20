import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import Translate from "src/components/translate";

const TermAndConditions = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ my: 2 }}
    >
      <Typography
        variant="body2"
        align="center"
        sx={{ color: "text.secondary", mt: 0 }}
      >
        <Link underline="always" color="text.primary" href="#">
          <Translate>register.terms</Translate>
        </Link>
        &nbsp; & &nbsp;
        <Link underline="always" color="text.primary" href="#">
          <Translate>register.policy</Translate>
        </Link>
      </Typography>
    </Stack>
  );
};

export default TermAndConditions;
