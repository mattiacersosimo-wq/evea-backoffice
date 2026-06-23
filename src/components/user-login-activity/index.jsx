import { Box, Card, CardHeader, Stack, Typography } from "@mui/material";
import moment from "moment";
import MyAvatar from "src/components/MyAvatar";
import PaginationButtons from "src/components/pagination";
import useAuth from "src/hooks/useAuth";
import Translate from "../translate";
import Activities from "./hooks/components/activities";
import useUserActivity from "./hooks/use-user-activity";

const UserLoginActivity = () => {
  const { user } = useAuth();

  const { count, data, onChange, page } = useUserActivity();
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={<MyAvatar />}
        title={
          <Box variant="subtitle2" color="text.primary">
            {user.username}
          </Box>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            <Translate>profile.profile.last_seen</Translate>:{" "}
            {data.lastSeen && moment(data.lastSeen).calendar()}
          </Typography>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="subtitle2">
          <Translate>profile.profile.activity_history</Translate>
        </Typography>
        <Stack spacing={1.5}>
          <Activities data={data.list} />
        </Stack>

        <Box sx={{ marginTop: "0px !important" }}>
          <PaginationButtons count={count} onChange={onChange} page={page} />
        </Box>
      </Stack>
    </Card>
  );
};

export default UserLoginActivity;
