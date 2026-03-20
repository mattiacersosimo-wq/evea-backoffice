import { Box, Stack, Typography } from "@mui/material";

const LabeledBox = ({ label, children }) => (
  <Box sx={{ padding: "2rem", margin: "0.8rem 0" }}>
    <Stack spacing={3}>
      <Typography variant="h6">{label}</Typography>
      {children}
    </Stack>
  </Box>
);

export default LabeledBox;
