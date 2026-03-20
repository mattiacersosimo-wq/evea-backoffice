import { Card, Stack, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";

import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";
import { useMemberProfileContext } from "..";

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const ProfileAbout = () => {
  const {
    memberProfile: { user_profile: data },
  } = useMemberProfileContext();

  const { t } = useTranslation();
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        {data?.username ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.username")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="userName"
          >
            <Stack direction="row">
              <IconStyle icon={"bxs:user-circle"} />
              <Typography variant="body2">{data?.username}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.email ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.mail")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="email"
          >
            <Stack direction="row">
              <IconStyle icon={"eva:email-fill"} />
              <Typography variant="body2">{data?.email}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.created_at ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.created_date")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="createdDate"
          >
            <Stack direction="row">
              <IconStyle
                icon={"healthicons:i-schedule-school-date-time-outline"}
              />
              <Typography variant="body2">
                <ParseDate date={data?.created_at} />
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.user_profile?.first_name ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.name")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="firstnameLastname"
          >
            <Stack direction="row">
              <IconStyle icon={"bxs:user"} />
              <Typography variant="body2">
                {data?.user_profile?.first_name} {data?.user_profile?.last_name}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.user_profile?.gender ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.gender")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="gender"
          >
            <Stack direction="row">
              <IconStyle icon={"ph:gender-intersex-bold"} />
              <Typography variant="body2">
                {data?.user_profile?.gender}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.user_profile?.mobile ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.mobile")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="mobile"
          >
            <Stack direction="row">
              <IconStyle icon={"carbon:phone-incoming-filled"} />
              <Typography variant="body2">
                {data?.user_profile?.mobile}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {data?.user_profile?.zipcode ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.pin")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="zipcode"
          >
            <Stack direction="row">
              <IconStyle icon={"akar-icons:home"} />
              <Typography variant="body2">
                {data?.user_profile?.zipcode}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}

        <Ternary
          when={data?.user_profile?.address}
          then={
            <Tooltip
              placement="right"
              title={t("profile.edit.address")}
              style={{ cursor: "pointer", width: "max-content" }}
              name="address"
            >
              <Stack direction="row">
                <IconStyle icon={"entypo:location-pin"} />
                <Typography variant="body2">
                  {data?.user_profile?.address}
                </Typography>
              </Stack>
            </Tooltip>
          }
        />

        {data?.user_profile?.city ? (
          <Tooltip
            placement="right"
            title={t("profile.edit.city")}
            style={{ cursor: "pointer", width: "max-content" }}
            name="city"
          >
            <Stack direction="row">
              <IconStyle icon={"healthicons:city"} />
              <Typography variant="body2">
                {data?.user_profile?.city}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
      </Stack>
    </Card>
  );
};

export default ProfileAbout;
