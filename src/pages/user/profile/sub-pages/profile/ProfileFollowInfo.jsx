import { Card, Divider, Stack, Typography } from "@mui/material";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import useAuth from "src/hooks/useAuth";

export default function ProfileFollowInfo() {
  const { user } = useAuth();

  const { totalCommission, totalPayout } = user;

  return (
    <Card sx={{ py: 3 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <Currency>{totalCommission}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>profile.profile.commission</Translate>
          </Typography>
        </Stack>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <Currency>{totalPayout}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>profile.profile.payout</Translate>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
