import { LinearProgress, Paper, Stack, Typography, Card } from "@mui/material";

import { EcommerceSaleByGender } from "src/sections/@dashboard/general/e-commerce";
import { fPercent } from "src/utils/formatNumber";

const test = [...Array(2)].map((_, index) => ({
  label: ["Left Leg", "Right Leg"][index],
  value: Math.random() * 100,
}));

const ProgressItem = ({ progress }) => (
  <Stack spacing={1}>
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {progress.label}
      </Typography>
      <Typography variant="body2">&nbsp;{fPercent(progress.value)}</Typography>
    </Stack>
    <LinearProgress variant="determinate" value={progress.value} />
  </Stack>
);

const ActiveUsers = () => (
  <Card sx={{ padding: "2rem" }} variant="outlined">
    <Stack>
      <EcommerceSaleByGender />
      <Stack spacing={4} sx={{ p: 3 }}>
        {test.map((progress) => (
          <ProgressItem key={progress.label} progress={progress} />
        ))}
      </Stack>
    </Stack>
  </Card>
);

export default ActiveUsers;
