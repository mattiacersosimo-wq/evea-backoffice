import {
  Box,
  Card,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Scrollbar from "src/components/Scrollbar";
import { Currency } from "src/components/with-prefix";

import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Translate from "src/components/translate";
import ReferralPerson from "src/images/referral-outline.png";
import useTeamPerformance from "./hooks/use-team-performance";

const headers = [
  "user_dashboard.team_performance.table.user",
  "user_dashboard.team_performance.table.referrals",
  "user_dashboard.team_performance.table.earnings",
];

const TeamPerformance = () => {
  const theme = useTheme();

  const state = useTeamPerformance();
  const { data, ...dataProps } = state;

  return (
    <Card sx={{ py: "5px" }}>
      <Typography variant="subtitle2" sx={{ my: 2, px: "10px" }}>
        <Translate>user_dashboard.team_performance.title</Translate>
      </Typography>

      <Stack spacing={1}>
        <Box sx={{ px: "0px" }}>
          <DataHandlerTable headers={headers} dataProps={dataProps}  sx={{height:"305px"}}>
            <Map
              list={data}
              render={({ username, earnings, referrals, profile_image }) => {
                return (
                  <TableRow>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
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
                            src={profile_image ? profile_image : ReferralPerson}
                          />
                        </Box>

                        <Box sx={{ borderRadius: "6px" }}>
                        <Typography 
                            sx={{
                              fontSize: "14px",
                              lineHeight: "1",
                              fontWeight: "300",
                              color:theme.palette.widgets.tdcell[300]
                            }}
                          >
                            {username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          fontSize: "14px",
                          color: theme.palette.widgets.tertiary[400],
                        }}
                      >
                        {referrals}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: "15px", fontWeight:400
                        }}
                      >
                        <Currency>{earnings}</Currency>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </DataHandlerTable>
        </Box>
      </Stack>
      {/* ============================== */}
    </Card>
  );
};

export default TeamPerformance;
