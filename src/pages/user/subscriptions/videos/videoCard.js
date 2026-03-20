import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import Vimeo from "@u-wave/react-vimeo";
import PropTypes from "prop-types";
import SvgIconStyle from "src/components/SvgIconStyle";
import TextMaxLine from "src/components/TextMaxLine";
import ParseDate from "src/components/date";

const VideoCard = ({ video }) => {
  const { video_title, created_at, video_url } = video;

  return (
    <>
      <Box mt={3}>
        <Card>
          <Box sx={{ position: "relative" }}>
            <SvgIconStyle
              src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: "absolute",
                color: "background.paper",
              }}
            />
            <Avatar
              alt="logo"
              src="https://freeiconshop.com/wp-content/uploads/edd/vimeo-flat.png"
              sx={{
                left: 24,
                zIndex: 9,
                width: 32,
                height: 32,
                bottom: -16,
                position: "absolute",
              }}
            />
            <Vimeo video={video_url} controls responsive />
          </Box>

          <CardContent
            sx={{
              width: 1,
              p: "24px 0 10px 24px",
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              component="div"
              sx={{
                color: "text.disabled",
              }}
            >
              <ParseDate date={created_at} />
            </Typography>
            <TextMaxLine variant="subtitle2" line={2} persistent>
              {video_title}
            </TextMaxLine>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

VideoCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default VideoCard;
