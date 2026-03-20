import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Vimeo from "@u-wave/react-vimeo";
import SvgIconStyle from "src/components/SvgIconStyle";
import TextMaxLine from "src/components/TextMaxLine";
import DataHandlerList from "src/components/data-handler/list";
import Loop from "src/components/loop";
import Translate from "src/components/translate";
import { useMaterialContext } from "../..";

const Videos = () => {
  const state = useMaterialContext();
  const { data, ...dataProps } = state;
  const { videos } = data;

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle2">
          <Translate>business_builder.materials.menu.video</Translate>
        </Typography>
        <DataHandlerList
          dataProps={{ ...dataProps }}
          forceEmpty={videos?.length === 0}
        >
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 2,
              gridTemplateColumns: {
                md: "repeat(3, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <Loop
              list={videos}
              render={({
                id,
                video_url: video,
                video_title,
                video_access_time,
              }) => (
                <Card sx={{ borderRadius: "4px" }}>
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
                    <Vimeo video={video} controls responsive />
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
                      {video_access_time}
                    </Typography>
                    <TextMaxLine variant="subtitle2" line={2} persistent>
                      {video_title}
                    </TextMaxLine>
                  </CardContent>
                </Card>
              )}
            />
          </Box>
        </DataHandlerList>
      </Stack>
    </Card>
  );
};

export default Videos;
