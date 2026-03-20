import { Card, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import useAuth from "src/hooks/useAuth";

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 30,
  height: 30,
  marginTop: 2,
  flexShrink: 0,
  marginRight: theme.spacing(0),
}));

export default function ProfileTwoCard() {
  const { user } = useAuth();
  const { referralCount, balanceAmount } = user;

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
          <Typography variant="h4">{referralCount || 0}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>profile.profile.referrals</Translate>
          </Typography>
        </Stack>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            <IconStyle icon={"material-symbols:account-balance-wallet"} />
          </Typography>
          <Typography variant="h4">
            <Currency>{balanceAmount}</Currency>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Translate>profile.profile.balance</Translate>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
