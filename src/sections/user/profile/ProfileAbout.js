import moment from "moment";

import { Card, Stack, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import useAuth from "src/hooks/useAuth";
import { useTranslation } from "react-i18next";

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const style = { width: "max-content", cursor: "pointer" };

export default function ProfileAbout() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { username, email, user_profile: userProfile } = user;
  if (!userProfile) return null;
  const {
    created_at,
    first_name: firstName,
    last_name: lastName,
    gender,
    mobile,
    zipcode,
    address,
    city,
  } = userProfile;
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        {username ? (
          <Tooltip
            title={t("profile.username")}
            style={style}
            placement="right"
            name="userName"
          >
            <Stack direction="row">
              <IconStyle icon={"bxs:user-circle"} />
              <Typography variant="body2">{username}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {email ? (
          <Tooltip
            placement="right"
            title={t("profile.email")}
            style={style}
            name="email"
          >
            <Stack direction="row">
              <IconStyle icon={"eva:email-fill"} />
              <Typography variant="body2">{email}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {created_at ? (
          <Tooltip
            placement="right"
            title={t("profile.dateJoined")}
            style={style}
            name="createdDate"
          >
            <Stack direction="row">
              <IconStyle
                icon={"healthicons:i-schedule-school-date-time-outline"}
              />
              <Typography variant="body2">
                <ParseDate date={created_at} />
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {firstName ? (
          <Tooltip
            placement="right"
            title={t("profile.first_name")}
            style={style}
            name="firstnameLastname"
          >
            <Stack direction="row">
              <IconStyle icon={"bxs:user"} />
              <Typography variant="body2">
                {firstName} {lastName}
              </Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {gender ? (
          <Tooltip
            placement="right"
            title={t("profile.gender")}
            style={style}
            name="gender"
          >
            <Stack direction="row">
              <IconStyle icon={"ph:gender-intersex-bold"} />
              <Typography variant="body2">{gender}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {mobile ? (
          <Tooltip
            placement="right"
            title={t("profile.phone_numbers")}
            style={style}
            name="mobile"
          >
            <Stack direction="row">
              <IconStyle icon={"carbon:phone-incoming-filled"} />
              <Typography variant="body2">{mobile}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {zipcode ? (
          <Tooltip
            placement="right"
            title={t("profile.zip_codes")}
            style={style}
            name="zipcode"
          >
            <Stack direction="row">
              <IconStyle icon={"akar-icons:home"} />
              <Typography variant="body2">{zipcode}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {address ? (
          <Tooltip
            placement="right"
            title={t("profile.address")}
            style={style}
            name="address"
          >
            <Stack direction="row">
              <IconStyle icon={"entypo:location-pin"} />
              <Typography variant="body2">{address}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
        {city ? (
          <Tooltip
            placement="right"
            title={t("profile.city")}
            style={style}
            name="city"
          >
            <Stack direction="row">
              <IconStyle icon={"healthicons:city"} />
              <Typography variant="body2">{city}</Typography>
            </Stack>
          </Tooltip>
        ) : null}
      </Stack>
    </Card>
  );
}
