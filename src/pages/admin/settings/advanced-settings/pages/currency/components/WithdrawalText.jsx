import React from "react";
import { Card, TextField, Typography } from "@mui/material";

const WithdrawalText = ({ handleChange, description }) => {
  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Withdrawal Text to Display on Members Page
        </Typography>
        <TextField
          name="description"
          onChange={handleChange()}
          value={description}
          multiline
          fullWidth
          rows={3}
        />
      </Card>
    </div>
  );
};

export default WithdrawalText;
