import { Box, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavLink as RouterLink } from "react-router-dom";
import Iconify from "src/components/Iconify";
import { IconButtonAnimate } from "src/components/animate";

import { PATH_USER } from "src/routes/paths";

const Footer = () => {
  const { palette } = useTheme();

  return (
    <Stack sx={{ marginTop: "3rem" }} spacing={3}>
      <Stack sx={{ textAlign: "center" }} spacing={1}>
        <Typography variant="h3">{"userHelpCenter.faq.youStill"}</Typography>
        <Typography>{"userHelpCenter.faq.ifYou"}</Typography>
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
              {"userHelpCenter.faq.weAreAlways"}
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
            <Typography variant="h5">Contact Support</Typography>
            <Typography variant="caption">
              {"userHelpCenter.faq.weAreAlways"}
            </Typography>
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
};

export default Footer;
