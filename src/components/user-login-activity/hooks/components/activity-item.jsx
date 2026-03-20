import { Paper, Stack, Typography } from "@mui/material";
import ParseDate from "src/components/date";
import UserImage from "./user-image";

const ActivityItem = ({ data }) => {
  return (
    <Stack key={data?.id} direction="row" spacing={2}>
      <UserImage username={data?.user?.username.slice(0, 1)} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2">{data?.user?.username}</Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            <ParseDate date={data?.created_at} />
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {data?.action} : {data?.ip_address}
        </Typography>
      </Paper>
    </Stack>
  );
};

export default ActivityItem;
