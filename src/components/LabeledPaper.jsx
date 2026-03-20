import { Paper, Stack, Typography, Card } from "@mui/material";

const LabeledPaper = ({ label, children }) => (
  <Card variant="outlined" sx={{ borderRadius: "7px" }}>
    <Stack spacing={2} sx={{ padding: "15px 0px 0px 15px" }}>
      <Typography variant="subtitle2">{label}</Typography>
      {children}
    </Stack>
  </Card>
);

export default LabeledPaper;
