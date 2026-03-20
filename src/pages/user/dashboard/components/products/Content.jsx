import { Avatar, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

const Content = ({ label, caption, price, avatar }) => (
  <Box sx={{ padding: "1rem" }}>
    <Stack direction="row" spacing={3} alignItems="center">
      <Avatar src={avatar} />
      <Stack spacing={0.5}>
        <Typography fontWeight="bold">{label}</Typography>
        <Typography variant="caption">{caption}</Typography>
        <Typography color="primary" fontWeight="bold" fontSize="0.9rem">
          {price}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);

export default Content;
