import { Box } from "@mui/material";
import React from "react";

const TopPanelBox = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { lg: "repeat(3, 1fr)", sm: "repeat(2, 1fr)" },
      columnGap: 3,
      rowGap: 3,
    }}
  >
    {children}
  </Box>
);

export default TopPanelBox;
