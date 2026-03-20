import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { ImageWithBackground } from "../TotalWidget";
import DateDropdown from "./components/date-dropdown";
import MembersChart from "./components/members-chart";
import useRegisterData from "./hooks/use-registered-data";
import { useTheme } from "@mui/material/styles";
import Translate from "src/components/translate";

const RegisteredMembers = () => {
  const { data, onDateChange, dateRange } = useRegisterData();

  const { members, holding_tank, network_members } = data;
  const theme = useTheme();

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            <Translate>global.users</Translate>
          </Typography>
        }
        action={
          <DateDropdown onDateChange={onDateChange} dateRange={dateRange} />
        }
      />
      <CardContent>
        <Stack textAlign="center">
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <ImageWithBackground
              src="/icons/dashboard/users.png"
              bgColor={theme.palette.widgets.blue[200]}
            />
          </Box>
          <Typography variant="countText">{members}</Typography>
          <Typography
            sx={{
              whiteSpace: "nowrap",
              fontWeight: "300",
            }}
            variant="subtitle3"
          >
            <Translate>global.total_members</Translate>
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Box sx={{ width: "50%" }}>
            <MembersChart
              label="network.holdingTank"
              portion={holding_tank}
              total={members}
            />
          </Box>

          <Box sx={{ width: "50%" }}>
            <MembersChart
              label="network.networkMembers"
              portion={network_members}
              total={members}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RegisteredMembers;
