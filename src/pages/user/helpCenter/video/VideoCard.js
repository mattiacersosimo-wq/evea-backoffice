import { Box, Card, CardContent, Typography } from "@mui/material";
import Vimeo from "@u-wave/react-vimeo";
import TextMaxLine from "src/components/TextMaxLine";
import ParseDate from "src/components/date";
import Translate from "src/components/translate";

const VideoCard = ({ videos }) => {
  const { video_url, created_at, updated_at, title } = videos;
  return (
    <Card mt={2}>
      <Box sx={{ position: "relative" }}>
        <Vimeo video={video_url} controls responsive />
      </Box>

      <CardContent
        sx={{
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
          <Translate>help_center.document.created_at</Translate>{" "}
          <ParseDate date={created_at} />
        </Typography>
        <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default VideoCard;
