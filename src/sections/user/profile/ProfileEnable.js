import React from "react";
// @mui
import { Alert, Card, Typography } from "@mui/material";

const ProfileEnable = () => {
  return (
    <div>
      <Card sx={{ p: 3, mt: 1 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          {"profile.twoStepAuthentication"}
        </Typography>
        <Alert severity="info" color="info">
          {"profile.thisAuthentication"}
        </Alert>
      </Card>
    </div>
  );
};

export default ProfileEnable;
