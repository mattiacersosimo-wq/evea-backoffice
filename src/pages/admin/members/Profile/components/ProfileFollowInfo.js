import { Card, Divider, Stack, Typography } from "@mui/material";
import { Currency } from "src/components/with-prefix";

import Translate from "src/components/translate";
import { useMemberProfileContext } from "..";

export default function ProfileFollowInfo() {
  const { memberProfile } = useMemberProfileContext();

  const { total_commission, total_payout } = memberProfile;

  return (
    <Card sx={{ py: 3 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <Currency>{total_commission}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>{"profile.total_commission"}</Translate>
          </Typography>
        </Stack>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <Currency>{total_payout}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate> {"profile.total_payout"}</Translate>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
