import { Box } from "@mui/material";

const ImageWrapper = ({ children }) => (
  <Box sx={{ p: 1 }}>
    <Box
      sx={{
        zIndex: 0,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </Box>
  </Box>
);

export default ImageWrapper;
