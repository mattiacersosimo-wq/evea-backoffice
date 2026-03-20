import {
  Box,
  Card,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import Translate from "src/components/translate";
import ReferralPerson from "src/images/referral-outline.png";
import ReferralMenu from "./components/menu";
import useReferrals from "./hooks/use-referrals";

const headers = [
  "user_dashboard.referrals_table.table.user",
  "user_dashboard.referrals_table.table.date",
  "user_dashboard.referrals_table.table.action",
];

const ReferralList = () => {
  const theme = useTheme();
  const { state } = useReferrals(false);

  const { data, ...dataProps } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("");

  const handleClick = (username) => (event) => {
    setAnchorEl(event.currentTarget);
    setUsername(username);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUsername("");
  };
  return (
    <Card sx={{ py: "5px" }}>
      <Typography variant="subtitle2" sx={{ my: 2, px: "10px" }}>
        <Translate>user_dashboard.referrals_table.title</Translate>
      </Typography>

      <Box sx={{ px: "0px" }}>
        <DataHandlerTable
          headers={headers}
          dataProps={dataProps}
          sx={{ height: "305px" }}
        >
          <Map
            list={data}
            render={({ username, email, created_at, user_profile }) => {
              return (
                <TableRow>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "6px",
                          overflow: "hidden",
                          mr: 1,
                          width: "35px",
                          height: "35px",
                        }}
                      >
                        <img
                          src={
                            user_profile?.profile_image
                              ? user_profile?.profile_image
                              : ReferralPerson
                          }
                        />
                      </Box>

                      <Box sx={{ borderRadius: "6px" }}>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            lineHeight: "1",
                            color: theme.palette.widgets.tdcell[300],
                            fontWeight: "300",
                          }}
                        >
                          {username}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.widgets.tertiary[600],
                            fontWeight: "300",
                          }}
                        >
                          {email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontSize: "14px",
                        ml: 1,
                        color: theme.palette.widgets.tdcell[300],
                      }}
                    >
                      <ParseDate date={created_at} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleClick(username)}>
                      <Iconify icon="mdi:dots-vertical" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </DataHandlerTable>
      </Box>

      <ReferralMenu
        anchorEl={anchorEl}
        onClose={handleClose}
        username={username}
      />
    </Card>
  );
};

export default ReferralList;
