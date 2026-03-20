import {
  Avatar,
  Card,
  CardHeader,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import MyAvatar from "src/components/MyAvatar";
import ParseDate from "src/components/date";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const ProfileActivityCard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axiosInstance("/api/activity");
      setData(data.data.data.data);
    };
    fetchData();
  }, []);

  const { username, user_profile: userProfile } = user;
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={<MyAvatar />}
        title={
          <Link
            to="#"
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
          >
            {username}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            Last Seen : {moment(userProfile?.createdAt).calendar()}
          </Typography>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography>Your Activity History</Typography>
        <Stack spacing={1.5}>
          {data?.slice(0, 8).map((item) => {
            const {
              user,
              created_at: createdAt,
              ip_address: ipAddress,
              action,
              id,
            } = item;
            const { username } = user;
            return (
              <Stack key={id} direction="row" spacing={2}>
                <Avatar src={userProfile?.profile_image}>
                  {username.slice(0, 1)}
                </Avatar>
                <Paper
                  sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2">{username}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      <ParseDate date={createdAt} />
                      {moment(createdAt).format("LT")}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {action} : {ipAddress}
                  </Typography>
                </Paper>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileActivityCard;
