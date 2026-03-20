import { Box } from "@mui/material";

export default ({ children }) => (
  <Box
    sx={{
      display: { lg: "flex" },
      minHeight: { lg: 1 },
    }}
  >
    {children}
  </Box>
);
