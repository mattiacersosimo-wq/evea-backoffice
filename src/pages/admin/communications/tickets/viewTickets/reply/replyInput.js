import { useRef } from "react";
// @mui
import {
  Box,
  Card,
  Button,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
// components

// ----------------------------------------------------------------------

export default function ProfilePostInput() {
  return (
    <Card sx={{ p: 3 }}>
      <TextField
        multiline
        fullWidth
        rows={4}
        value="Share what you are thinking here"
        disabled
        sx={{
          "& fieldset": {
            borderWidth: `1px !important`,
            borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
          },
        }}
      />
    </Card>
  );
}
