import Box from "@material-ui/core/Box";
import { CircularProgress } from "@mui/material";

const Progress = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

export default Progress;
