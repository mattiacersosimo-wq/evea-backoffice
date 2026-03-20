import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Image from "src/components/Image";

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

export default function BlogPostHero({ cover }) {
  return (
    <Box sx={{ position: "relative" }}>
      <FooterStyle></FooterStyle>

      <OverlayStyle />
      <Image alt="post cover" src={cover} ratio="16/9" />
    </Box>
  );
}
