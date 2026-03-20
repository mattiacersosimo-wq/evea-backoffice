import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import DataHandlerTable from "src/components/data-handler/table";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import Ternary from "src/components/ternary";

import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import axiosInstance from "src/utils/axios";
import AddDialog from "./videos/addDialog";
import VideoList from "./videos/videoList";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    remove: test("delete"),
  };
};

const useGetVideo = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchVideos = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance(
        `/api/admin/tool-videos?page=${page}`
      );

      const { status, data: documents } = data;
      if (status) {
        const { last_page, from, data: list } = documents;
        seed(last_page, from);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (error) {
      actions.error();
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  return { state, fetchVideos, count, onChange, page, rowStart };
};

const Videos = () => {
  const [editVideo, setEditVideo] = useState(null);
  const { state, fetchVideos, count, onChange, page, rowStart } = useGetVideo();
  const { data, ...dataProps } = state;
  const [addVideo, setAddVideo] = useState(null);
  const { add, ...status } = genStatus("nav.tools.title", "nav.tools.videos");
  return (
    <Page title={"tools.videos.videos_tool"}>
      <Box>
        <HeaderBreadcrumbs
          heading={"tools.videos.video"}
          links={[
            { name: "global.dashboard", href: PATH_DASHBOARD.root },
            { name: "tools.videos.video" },
          ]}
        />
        <Card>
          <Ternary
            when={add}
            then={
              <Box sx={{ p: 1.5, display: "flex", justifyContent: "right" }}>
                <AddDialog fetchVideo={fetchVideos} addVideo={addVideo} />
              </Box>
            }
          />

          <VideoList
            rowStart={rowStart}
            dataProps={dataProps}
            status={status}
            videos={data}
            fetchVideo={fetchVideos}
            setEditVideo={setEditVideo}
          />
        </Card>
        <Ternary
          when={!dataProps.isArrayEmpty}
          then={
            <PaginationButtons count={count} onChange={onChange} page={page} />
          }
        />
      </Box>
    </Page>
  );
};

export default Videos;
