import { Card, CardHeader, Stack, Typography } from "@mui/material";
import useAuth from "src/hooks/useAuth";

export default function ProfileSponsorCard() {
  const {
    user: { is_super_admin: isSuperAdmin },
  } = useAuth();

  if (Boolean(isSuperAdmin)) return null;

  return (
    <Card>
      <CardHeader title="Sponsor Information" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="column" alignItems="start">
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {"profile.name"} :
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {"profile.Username"} :
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {"profile.country"} :
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {"profile.dateJoined"} :
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
