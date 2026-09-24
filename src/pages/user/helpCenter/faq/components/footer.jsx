import { Box, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { NavLink as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { IconButtonAnimate } from "src/components/animate";

import { PATH_USER } from "src/routes/paths";

const Footer = () => {
  const { palette } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack sx={{ marginTop: "3rem" }} spacing={3}>
      <Stack sx={{ textAlign: "center" }} spacing={1}>
        <Typography variant="h3">{t("help_center.faq.still_have_questions")}</Typography>
        <Typography>{t("help_center.faq.if_you_have")}</Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          rowGap: 2,
          columnGap: 2,
          gridTemplateColumns: {
            md: "repeat(2,1fr)",
          },
        }}
      >
        <Card sx={{ padding: "2rem" }}>
          <Stack alignItems="center" spacing={1}>
            <Iconify
              icon="bx:phone-call"
              sx={{
                fontSize: "2rem",
                color: palette.primary.main,
              }}
            />
            <Typography variant="h5">+ (91) 1234 5678</Typography>
            <Typography variant="caption">
              {t("help_center.faq.we_are_always")}
            </Typography>
          </Stack>
        </Card>
        <Card sx={{ padding: "2rem" }}>
          <Stack alignItems="center" spacing={1}>
            <IconButtonAnimate
              component={RouterLink}
              to={PATH_USER.helpCenter.createTicket.subCategory()}
            >
              <Iconify
                icon="teenyicons:headset-solid"
                sx={{
                  fontSize: "2rem",
                  color: palette.primary.main,
                }}
              />
            </IconButtonAnimate>
            <Typography variant="h5">{t("help_center.faq.contact_support")}</Typography>
            <Typography variant="caption">
              {t("help_center.faq.we_are_always")}
            </Typography>
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
};

export default Footer;
