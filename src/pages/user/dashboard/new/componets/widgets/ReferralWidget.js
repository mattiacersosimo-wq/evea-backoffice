import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Iconify from "src/components/Iconify";
import MyAvatarReferral from "src/components/MyAvatarRefferal";
import { getRankById } from "src/components/tree/components/rank";
import { WEBSITE_URL } from "src/config.js";
import useIsDarkMode from "src/hooks/use-is-darkmode";
import useAuth from "src/hooks/useAuth";
import useAuthUserRank from "src/hooks/useAuthUserRank";

import buildPath from "src/utils/build-path";
import "./style.css";
import Transition from "src/utils/dialog-animation";

export default function ReferralWidget() {
  const { user } = useAuth();
  const { rank_name, id: rank_id } = useAuthUserRank();
  const { logo } = getRankById(rank_id);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    if (user.username) setReferralLink(buildPath(WEBSITE_URL, user.username));
  }, [user]);

  const { enqueueSnackbar } = useSnackbar();
  const copy = async () => {
    await navigator.clipboard.writeText(referralLink);
    enqueueSnackbar("Copied to clipboard");
  };
  const [openShare, setOpenShare] = useState(false);
  const { palette } = useTheme();
  const isDark = useIsDarkMode();
  return (
    <>
      <Box
        sx={{
          backgroundColor: palette.primary.main,
          minHeight: 150,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <MyAvatarReferral
            src={user.user_profile?.profile_image}
            variant="circular"
            sx={{
              width: 56,
              height: 56,
              mt: 2,
              border: "solid 2px #fff",
            }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          color="white"
          sx={{ fontSize: "17px", textTransform: "capitalize", mt: 0.5 }}
        >
          {user.user_profile?.first_name ?? "_"}
        </Typography>
        <Typography
          color="white"
          variant="subtitle2"
          sx={{
            fontSize: "14px",
            textTransform: "capitalize",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={logo} style={{ width: 20, height: 20 }} />
          &nbsp; <span style={{ fontWeight: 100 }}>Rank</span> :{rank_name}
        </Typography>
      </Box>

      <Card
        sx={{
          mt: "-10px",
          borderBottomRightRadius: "4px",
          borderBottomLeftRadius: "4px",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        }}
      >
        <Box p={2}>
          <Typography variant="subtitle2" color="text.primary">
            {"userDashboard.referralLink"}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              padding: "2px 0px",
              borderRadius: "4px",
            }}
          >
            <Typography
              sx={{
                color: isDark ? "primary.light" : "primary.dark",
                fontSize: "13px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {referralLink}
            </Typography>

            <Box>
              <IconButton
                sx={{
                  color: isDark ? "primary.light" : "primary.dark",
                  backgroundColor: "#f1f1f19e",
                  mr: 1,
                }}
                variant="contained"
                size="small"
                onClick={() => copy()}
              >
                <Iconify icon="mi:attachment" sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton
                sx={{
                  color: isDark ? "primary.light" : "primary.dark",
                  backgroundColor: "#f1f1f19e",
                }}
                variant="contained"
                size="small"
                onClick={() => setOpenShare(true)}
              >
                <Iconify
                  icon="mdi:share-outline"
                  sx={{ color: "primary.main" }}
                />
              </IconButton>
            </Box>
          </Stack>
          <Typography
            variant="caption"
            sx={{ mt: 1, mb: 2, color: "#919eab", fontWeight: 500 }}
          >
            {"userDashboard.sendThisLinkToYourReferrals"}
          </Typography>
        </Box>
      </Card>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openShare}
        onClose={() => setOpenShare(false)}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            "& .react-share__ShareButton": {
              margin: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              rowGap: 3,
              columnGap: 2,
              alignItems: "center",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Box>
              <Typography variant="subtitle2">Share Referral Link</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <IconButton
                sx={{
                  color: isDark ? "warning.light" : "primary.dark",
                  backgroundColor: "#f1f1f19e",
                }}
                variant="contained"
                size="small"
                onClick={() => setOpenShare(false)}
              >
                <Iconify icon="iconamoon:close-bold" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <TwitterShareButton url={referralLink}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>

            <FacebookShareButton url={referralLink}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>

            <TelegramShareButton url={referralLink}>
              <TelegramIcon size={40} round />
            </TelegramShareButton>

            <WhatsappShareButton url={referralLink} separator="::">
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
