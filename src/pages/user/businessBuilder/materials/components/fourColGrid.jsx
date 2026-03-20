import { Box } from "@mui/material";
import React from "react";

const FourColGrid = ({ children }) => (
  <Box
    sx={{
      padding: "2rem 0",
      display: "grid",
      gridTemplateColumns: { md: "repeat(4, 1fr)", sm: "repeat(2, 1fr)" },
      columnGap: 3,
      rowGap: 3,
    }}
  >
    {children}
  </Box>
);

export default FourColGrid;
