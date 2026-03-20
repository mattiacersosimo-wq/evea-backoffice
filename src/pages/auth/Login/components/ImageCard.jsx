import { Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "src/components/Image";
import Translate from "src/components/translate";
import useResponsive from "src/hooks/useResponsive";
import LoginBanner from "src/images/login.webp";

const ImageCard = () => {
  const mdUp = useResponsive("up", "md");

  return (
    mdUp && (
      <SectionStyle>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          <Translate>register.welcome_back</Translate>
        </Typography>
        <Image visibleByDefault disabledEffect alt="login" src={LoginBanner} />
      </SectionStyle>
    )
  );
};

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 564,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

export default ImageCard;
