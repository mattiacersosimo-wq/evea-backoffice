import { Button, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";

import Translate from "src/components/translate";
import useFetch from "../documents/hooks/useFetch";
import VideoCard from "./videoCard";

const VideoList = () => {
  const { categories, data: videos, rowStart, ...rest } = useFetch("videos");
  const [state, actions] = useDataHandler();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data, ...dataProps } = state;
  useEffect(() => {
    actions.loading();
    if (videos.length > 0) {
      if (selectedCategory === "all") {
        actions.success(videos);
      } else {
        actions.success(
          videos.filter(({ category_id }) => category_id === selectedCategory)
        );
      }
    } else {
      actions.success([]);
    }
  }, [videos, selectedCategory]);
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          height: "500px",
        }}
      >
        <Grid item md={3}>
          <Scrollbar
            sx={{
              height: "500px",
            }}
          >
            <Stack spacing={1}>
              <Button
                onClick={() => setSelectedCategory("all")}
                variant={selectedCategory === "all" ? "contained" : "text"}
              >
                <Translate>global.all</Translate>
              </Button>
              <Map
                list={categories}
                render={({ id, name }) => (
                  <Button
                    variant={selectedCategory === id ? "contained" : "text"}
                    onClick={() => setSelectedCategory(id)}
                  >
                    {name}
                  </Button>
                )}
              />
            </Stack>
          </Scrollbar>
        </Grid>

        <Grid item md={9} sx={{ width: "100%", height: "100%" }}>
          <Scrollbar
            sx={{
              height: "500px",
            }}
          >
            <DataHandlerList dataProps={dataProps}>
              <Grid container spacing={3}>
                <Map
                  list={data}
                  render={(video) => (
                    <Grid key={video.i} item md={4}>
                      <VideoCard video={video} />
                    </Grid>
                  )}
                />
              </Grid>
            </DataHandlerList>
          </Scrollbar>
        </Grid>
      </Grid>
      <PaginationButtons {...rest} />
    </>
  );
};

export default VideoList;
