import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import Translate from "src/components/translate";
import useErrors from "src/hooks/useErrors";
import { useTheme } from "@mui/material/styles";


import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
const headers = ["global.no", "global.user", "user_nav.genealogy.sponsor", "profile.dateJoined", "global.country"];
const useLatest = () => {
  const [state, actions] = useDataHandler();

  const handleErrors = useErrors();

  useEffect(() => {
    const fetchData = async () => {
      actions.loading();
      try {
        const { status, data } = await axiosInstance(
          URI.admin.network.latestRegistrations
        );

        if (status === 200) {
          actions.success(data.data);
          return;
        }
        actions.success();
      } catch (err) {
        actions.error();
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return state;
};
const LatestRegistration = () => {
  const state = useLatest();
  const { data, ...dataProps } = state;
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="subtitle2" sx={{mt:"-5px"}}>
            <Translate>network.latest_registrations</Translate>
          </Typography>
        }
      />
      <CardContent sx={{ p: 1, pt:2 }}>
        <DataHandlerTable headers={headers} dataProps={dataProps} sx={{height:"640px"}}>
          <Map
            list={data}
            render={(
              { username, email, created_at, user_profile, sponsor },
              i
            ) => {
              return (
                <TableRow>
                  <TableCell sx={{color:theme.palette.widgets.tertiary[450],}}>{i + 1}</TableCell>
                  <TableCell>
                    <Stack>
                    <Typography sx={{fontWeight:"300",fontSize:"15px",color:theme.palette.widgets.tertiary[400],}}> {username}</Typography>
                      <Typography variant="subtitle3" sx={{fontWeight:"300",fontSize:"13.5px"}}>{email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{color:theme.palette.widgets.tertiary[450],}}>{sponsor?.user?.username}</TableCell>
                  <TableCell sx={{color:theme.palette.widgets.tertiary[450],}}>
                    <ParseDate date={created_at} />
                  </TableCell>
                  <TableCell sx={{color:theme.palette.widgets.tertiary[450],}}>{user_profile?.country}</TableCell>
                </TableRow>
              );
            }}
          />
        </DataHandlerTable>
      </CardContent>
    </Card>
  );
};

AuthorItem.propTypes = {
  id: PropTypes.number,
  username: PropTypes.string,
  email: PropTypes.string,
  created_at: PropTypes.string,
  user_profile: PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

function AuthorItem({ created_at, email, user_profile }) {
  const { first_name, profile_image } = user_profile;
  const createdDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const createdTime = new Date(created_at).toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={first_name} src={profile_image} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle3">{first_name}</Typography>
        <Typography
          variant="subtitle3"
          sx={{
            mt: 0.5,
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          {email}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Typography variant="subtitle2">{createdDate}</Typography>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            color: "text.secondary",
          }}
        >
          {createdTime}
        </Typography>
      </Box>
    </Stack>
  );
}

export default LatestRegistration;
