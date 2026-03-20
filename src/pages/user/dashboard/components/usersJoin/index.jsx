import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import LabeledBox from "src/components/LabeledBox";

const priceList = Array.from(
  { length: 8 },
  () => Math.round(Math.random() * 100) / 100
);

const UsersJoin = () => {
  return (
    <Paper>
      <LabeledBox label="Users Join">
        <Stack spacing={2}>
          <Typography>Overview of latest joining</Typography>
          <Stack>
            {priceList.map((price) => (
              <Typography variant="body2">{price}</Typography>
            ))}
          </Stack>
        </Stack>
      </LabeledBox>
      <Divider />
      <Box
        sx={{
          padding: "2rem",
          margin: "0.8rem 0 0 0",
          display: "grid",
          columnGap: 2,
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        <JoiningCard label="Weekly Joining" number={0} />
        <JoiningCard label="Monthly Joining" number={0} />
        <JoiningCard label="Yearly Joining" number={0} />
      </Box>
    </Paper>
  );
};

const JoiningCard = ({ label, number }) => {
  return (
    <Paper variant="outlined" sx={{ padding: "2rem" }}>
      <Stack direction="row" spacing={3}>
        <Iconify
          icon="emojione-monotone:double-curly-loop"
          sx={{
            fontSize: "3rem",
          }}
        />
        <Stack>
          <Typography fontWeight="bold">{label}</Typography>
          <Typography fontWeight="light">{number}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UsersJoin;
