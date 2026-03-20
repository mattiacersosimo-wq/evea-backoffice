import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { MemberAvatar } from "src/components/MyAvatar";
import ParseDate from "src/components/date";

import axiosInstance from "src/utils/axios";
import { useMemberProfileContext } from "..";
import Translate from "src/components/translate";
import usePagination from "src/components/pagination/usePagination";
import PaginationButtons from "src/components/pagination";

ProfileActivityCard.propTypes = {
  post: PropTypes.object,
};

export default function ProfileActivityCard() {
  const { mid } = useParams();
  const { count, onChange, page, seed } = usePagination();
  const [data, setData] = useState({ list: [] });
  const { memberProfile } = useMemberProfileContext();
  const [lastLogout, setLastLogout] = useState(null);
  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const { status, data } = await axiosInstance(
          `/api/user-activity/${mid}`,
          {
            params: { page },
          }
        );
        if (status === 200) {
          const { last_logout } = data;
          const { last_page, from, data: list } = data.data;
          seed(last_page, from);
          setData((prev) => ({ ...prev, list }));
          setLastLogout(last_logout);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData(page);
  }, [mid, page]);
  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <MemberAvatar
            name={memberProfile.user_profile?.username}
            uri={memberProfile.user_profile?.user_profile?.profile_image}
          />
        }
        title={
          <Link
            to="#"
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
          >
            {memberProfile.user_profile?.username}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            <Translate>{"profile.last_seen"}</Translate> :{" "}
            {lastLogout && moment(lastLogout).calendar()}
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
}
const Activities = ({ data }) => (
  <>
    {data?.map((item) => (
      <Stack key={item.id} direction="row" spacing={2}>
        <MemberAvatar
          name={item.user?.username}
          uri={item.user?.user_profile?.profile_image}
        />

        <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="subtitle2">{item.user?.username}</Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {moment(item.created_at).calendar()}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {item.action} : {item.ip_address}
          </Typography>
        </Paper>
      </Stack>
    ))}
  </>
);
