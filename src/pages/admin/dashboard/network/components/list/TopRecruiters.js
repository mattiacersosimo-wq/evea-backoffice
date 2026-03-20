import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import Translate from "src/components/translate";
import useErrors from "src/hooks/useErrors";

import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";

const useTopRecruiters = () => {
  const handleErrors = useErrors();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          URI.admin.network.topRecruiters
        );
        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

const TopRecruiters = () => {
  const topRecruiters = useTopRecruiters();
  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>network.top_recruiters</Translate>
          </Typography>
        }
      />
      <Scrollbar>
        <Stack
          spacing={3}
          sx={{
            p: 3,
            maxHeight: 306,
            overflow: "auto",
          }}
        >
          {topRecruiters.map((recruiter) => (
            <AuthorItem key={recruiter.id} {...recruiter} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
};

function AuthorItem({ count, sponsor, user, user_profile }) {
  const { profile_image } = user_profile || {};

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={user.username} src={profile_image} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{user.username}</Typography>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          {user?.email}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Typography variant="subtitle2">
          {"adminDashboard.network.count"}: {count}
        </Typography>
      </Box>
    </Stack>
  );
}

export default TopRecruiters;
