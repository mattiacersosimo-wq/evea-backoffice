import { Box, Card } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";
import { TimeOutList } from "src/components/timout-table";

import { PATH_USER } from "src/routes/paths";
import VideoCard from "./VideoCard";
import useGetVideo from "./hook/useGetVideo";

const Index = () => {
  const { videos, timeOut, ...rest } = useGetVideo();

  const isNotEmpty = Boolean(videos.length);

  return (
    <Page title="help_center.video.title">
      <Box>
        <HeaderBreadcrumbs
          heading="help_center.video.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "help_center.video.title" },
          ]}
        />
        <Card sx={{ p: 2 }}>
          <TimeOutList length={videos.length} isTimedOut={timeOut}>
            <Ternary
              when={isNotEmpty}
              then={
                <Box
                  sx={{
                    display: "grid",
                    rowGap: 3,
                    columnGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1 ,1fr)",
                      sm: "repeat(3 ,1fr)",
                    },
                  }}
                >
                  {videos.map((video, i) => (
                    <Box key={i}>
                      <VideoCard videos={video} />
                    </Box>
                  ))}
                </Box>
              }
            />
          </TimeOutList>
        </Card>
        <Ternary when={isNotEmpty} then={<PaginationButtons {...rest} />} />
      </Box>
    </Page>
  );
};
export default Index;
