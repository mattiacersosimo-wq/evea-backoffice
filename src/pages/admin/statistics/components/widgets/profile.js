import PropTypes from "prop-types";
// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// utils
import cssStyles from "src/utils/cssStyles";
import { fShortenNumber } from "src/utils/formatNumber";
// components
import Image from "src/components/Image";
import SocialsButton from "src/components/SocialsButton";
import SvgIconStyle from "src/components/SvgIconStyle";

// ----------------------------------------------------------------------

const OverlayStyle = styled("div")(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: "100%",
  height: "100%",
  position: "absolute",
}));

// ----------------------------------------------------------------------

export default function ProfileWidget() {
  return (
    <Card sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative" }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 150,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -1,
            mx: "auto",
            position: "absolute",
            color: "background.paper",
          }}
        />
        <Avatar
          src="https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_1.jpg"
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -20,
            mx: "auto",
            position: "absolute",
          }}
        />
        <OverlayStyle />
        <Image
          src="https://i.pinimg.com/236x/cc/e0/78/cce078329ede2e53f7dde2d205e93c79.jpg"
          alt="pic"
          ratio="16/9"
        />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        Jayvion Simon
      </Typography>

      <Divider sx={{ borderStyle: "dashed", marginTop: 1, marginBottom: 1 }} />

      <Stack alignItems="center" sx={{ mb: 1 }}>
        <Button variant="text" size="small">
          View Profile
        </Button>
      </Stack>
    </Card>
  );
}
