import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import usePagination from "src/components/pagination/usePagination";
import axiosInstance from "src/utils/axios";

const useMaterialVideo = () => {
  const [state, actions] = useDataHandler();
  const { id } = useParams();
  const { count, onChange, page, rowStart, seed } = usePagination();

  const fetchVideos = async (page = 1) => {
    actions.loading();

    try {
      const { data } = await axiosInstance.get(
        `/api/admin/materials-video/${id}?page=${page}`
      );
      const { status, data: videos } = data;
      if (status) {
        const { data: list, last_page, from } = videos;
        seed(last_page, from);
        actions.success(list.find(Boolean)?.material_videos);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  return {
    state,
    count,
    onChange,
    rowStart,
    page,
    fetchVideos: () => fetchVideos(page),
  };
};
export default useMaterialVideo;
