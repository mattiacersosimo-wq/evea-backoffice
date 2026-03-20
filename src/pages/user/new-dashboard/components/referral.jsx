import {
  Box,
  Dialog,
  DialogContent,
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
import { WP_URL } from "src/config.js";
import useIsDarkMode from "src/hooks/use-is-darkmode";
import useAuth from "src/hooks/useAuth";
import useAuthUserRank from "src/hooks/useAuthUserRank";

import buildPath from "src/utils/build-path";
import Transition from "src/utils/dialog-animation";

const Referral = () => {
  const { user } = useAuth();
  const { rank_name } = useAuthUserRank();
  const [referralLink, setReferralLink] = useState("");

  // useEffect(() => {
  //   if (user.username) setReferralLink(buildPath(WP_URL, user.username));
  // }, [user]);

  useEffect(() => {
    if (user?.username) {
      setReferralLink(`${WP_URL}?ref=${user.username}`);
    }
  }, [user]);

  const { enqueueSnackbar } = useSnackbar();
  const copy = async () => {
    await navigator.clipboard.writeText(referralLink);
    enqueueSnackbar("Copied to clipboard");
  };
  const [openShare, setOpenShare] = useState(false);
  const isDark = useIsDarkMode();
  const theme = useTheme();
  return (
    <div>
      <Box
        sx={{
          backgroundImage: "url('/dashboard/referral-bg.png')",
          backgroundSize: "cover",
          textAlign: "center",
          borderRadius: "16px",
          pt: 1,
          filter: theme.customShadows.referralWidget,
          mr: { lg: "auto", md: "15px", xs: "auto" },
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
            sx={{
              width: 56,
              height: 56,
              mt: 2,
              borderRadius: "16px",
            }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          color="white"
          sx={{
            fontSize: "16px",
            textTransform: "capitalize",
            mt: 0.5,
            fontWeight: "400",
            minHeight: "20px",
          }}
        >
          {user.user_profile?.first_name ?? "_"}
        </Typography>
        <Typography
          color="white"
          sx={{
            fontSize: "14px",
            textTransform: "capitalize",
            display: "flex",
            justifyContent: "center",
            fontWeight: "300",
            minHeight: "18px",
          }}
        >
          {/* <img src={logo} style={{ width: 20, height: 20 }} /> */}
          {/* &nbsp; <span style={{ fontWeight: 100 }}>Rank</span> : */}
          {rank_name}
        </Typography>

        <Box
          sx={{
            mt: "-10px",
            borderBottomRightRadius: "4px",
            borderBottomLeftRadius: "4px",
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          }}
        >
          <Box p={2} py={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{
                padding: "2px 0px",
                borderRadius: "4px",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  border: "1px solid #b5b5b5",
                  padding: "3px 5px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  width: "calc(100% - 70px)",
                }}
              >
                {referralLink}
              </Typography>

              <Box sx={{ width: "70px", display: "flex" }}>
                <Box
                  sx={{
                    color: isDark ? "primary.light" : "primary.dark",
                    backgroundColor: "#fff",
                    mr: 0.5,
                    ml: 1,
                    borderRadius: "6px",
                    width: "26px",
                    height: "26px",
                    cursor: "pointer",
                    lineHeight: "30px",
                  }}
                  size="small"
                  onClick={() => copy()}
                >
                  <Iconify
                    icon="mi:attachment"
                    sx={{ color: "primary.main" }}
                  />
                </Box>
                <Box
                  sx={{
                    color: isDark ? "primary.light" : "primary.dark",
                    backgroundColor: "#fff",
                    mr: 0.5,
                    borderRadius: "6px",
                    width: "26px",
                    height: "26px",
                    cursor: "pointer",
                    lineHeight: "30px",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => setOpenShare(true)}
                >
                  <Iconify
                    icon="mdi:share-outline"
                    sx={{ color: "primary.main" }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
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
    </div>
  );
};

export default Referral;
