import {
  Avatar,
  Box,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import useAuth from "src/hooks/useAuth";
import useResponsive from "src/hooks/useResponsive";
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

const OverlayStyle = styled("h1")(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 9,
  position: "absolute",
}));

const FooterStyle = styled("div")(({ theme }) => ({
  bottom: 0,
  zIndex: 10,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "flex-end",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    alignItems: "center",
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(10),
  },
}));

BlogPostHero.propTypes = {
  post: PropTypes.object.isRequired,
};

export default function BlogPostHero({ post }) {
  const { image_url: cover, created_at: createdAt } = post;
  const SOCIALS = [
    {
      name: "Facebook",
      icon: (
        <FacebookShareButton url={cover}>
          <FacebookIcon size={48} round />
        </FacebookShareButton>
      ),
    },
    {
      name: "Instagram",
      icon: (
        <>
          <WhatsappShareButton url={cover}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>
        </>
      ),
    },
    {
      name: "Telegram",
      icon: (
        <TelegramShareButton url={cover}>
          <TelegramIcon size={48} round />
        </TelegramShareButton>
      ),
    },
    {
      name: "Twitter",
      icon: (
        <TwitterShareButton url={cover}>
          <TwitterIcon size={48} round />
        </TwitterShareButton>
      ),
    },
  ];

  const { user } = useAuth();
  const { user_profile } = user || {};
  const isDesktop = useResponsive("up", "sm");
  return (
    <Box sx={{ position: "relative" }}>
      <FooterStyle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Avatar
            alt="John Doe"
            src={user_profile?.profile_image}
            sx={{ width: 48, height: 48 }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "black" }}>
              {user.username}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              {new Date(createdAt).toLocaleDateString("en-GB")}
            </Typography>
          </Box> */}
        </Box>

        <SpeedDial
          direction={isDesktop ? "left" : "up"}
          ariaLabel="Share post"
          icon={
            <Iconify icon="eva:share-fill" sx={{ width: 20, height: 20 }} />
          }
          sx={{ "& .MuiSpeedDial-fab": { width: 48, height: 48 } }}
        >
          {SOCIALS.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipPlacement="top"
              FabProps={{ color: "default" }}
            />
          ))}
        </SpeedDial>
      </FooterStyle>

      <OverlayStyle />
      <Image alt="post cover" src={cover} ratio="21/9" />
    </Box>
  );
}
