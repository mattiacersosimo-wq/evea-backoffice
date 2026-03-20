import { Card, CardHeader, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";

import { HideFromHoldingTank } from "src/pages/user/dashboard/components/wrappers";

export default function ProfileSponsorCard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  if (Boolean(user?.is_super_admin)) return null;
  const { name, username, country, joinedAt } = user.sponsorInfo || {};

  return (
    <>
      <HideFromHoldingTank>
        <Card>
          <CardHeader title={t("global.sponsor_information")} />
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack direction="column" alignItems="start">
              <Ternary
                when={name}
                then={
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >
                    {t("global.name")} : {name}
                  </Typography>
                }
              />
              <Ternary
                when={username}
                then={
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >
                    {t("global.username")} : {username}
                  </Typography>
                }
              />

              <Ternary
                when={country}
                then={
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >
                    {t("global.country")} : {country}
                  </Typography>
                }
              />

              <Ternary
                when={joinedAt}
                then={
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary" }}
                  >
                    {t("global.dateJoined")} :
                    <ParseDate date={joinedAt} format="DD/MM/YYYY" />
                  </Typography>
                }
              />
            </Stack>
          </Stack>
        </Card>
      </HideFromHoldingTank>
    </>
  );
}
