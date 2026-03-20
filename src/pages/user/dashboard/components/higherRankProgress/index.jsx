import {
  Box, Card,
  Divider, LinearProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";

const Progress = ({ label, value }) => {
  return (
    <Box>
      <Typography sx={{ paddingBottom: "0.3rem" }} fontWeight="bold">
        {label}
      </Typography>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
};

export default () => (
  <Card sx={{ padding: "2rem" }} variant="outlined">
    <Typography variant="subtitle1">Higher Rank Progress</Typography>
    <Divider sx={{ mt: 2, mb: 5 }} />
    <Stack spacing={5}>
      <Progress label="Business Builder" value={11} />
      <Progress label="Bronze executive" value={50} />
      <Progress label="Silver executive" value={20} />
      <Progress label="Gold executive" value={30} />
      <Progress label="Emerald executive" value={5} />
    </Stack>
  </Card>
);
