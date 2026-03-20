import { Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "src/components/Image";
import Translate from "src/components/translate";
import useResponsive from "src/hooks/useResponsive";
import LoginBanner from "src/images/login.webp";

const ImageCard = ({ title, image, features_and_benefits }) => {
  const mdUp = useResponsive("up", "md");

  return (
    mdUp && (
      <SectionStyle>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 1 }}>
          {title}
          {/* <Translate>register.welcome_back</Translate> */}
        </Typography>

        <Typography variant="subtitle1" sx={{ pl: 5, mb: 5 }}>
          {features_and_benefits}
          {/* <Translate>register.welcome_back</Translate> */}
        </Typography>
        <Image
          visibleByDefault
          disabledEffect
          alt="login"
          src={image ? image : LoginBanner}
        />
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
