import { Card, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Iconify from "src/components/Iconify";
import { Currency } from "src/components/with-prefix";

import { useMemberProfileContext } from "..";
import Translate from "src/components/translate";

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 30,
  height: 30,
  marginTop: 2,
  flexShrink: 0,
  marginRight: theme.spacing(0),
}));

// ----------------------------------------------------------------------

export default function ProfileTwoCard() {
  const { memberProfile } = useMemberProfileContext();

  const { referral_count, balance_amount } = memberProfile;
  return (
    <Card sx={{ py: 3 }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <IconStyle icon={"bx:user-pin"} style={{ color: "green" }} />
          </Typography>
          <Typography variant="h4">{referral_count}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>{"profile.referrals"}</Translate>
          </Typography>
        </Stack>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <IconStyle icon={"material-symbols:account-balance-wallet"} />
          </Typography>
          <Typography variant="h4">
            <Currency>{balance_amount}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>{"profile.balance"}</Translate>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
