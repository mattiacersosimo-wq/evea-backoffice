import { useEffect, useState } from "react";
import { useParams } from "react-router";
import usePagination from "src/components/pagination/usePagination";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetVideo = () => {
  const [state, actions] = useDataHandler();
  const { count, onChange, page, seed, rowStart } = usePagination();
  const { pid } = useParams();
  const handleErrors = useErrors();
  const fetchVideos = async (page = 1) => {
    actions.loading();
    try {
      const { data } = await axiosInstance.get(
        `/api/admin/product-videos/${pid}?page=${page}`
      );
      const { status, data: videos } = data;
      if (status) {
        const { last_page, from, data: list } = videos;
        seed(last_page, from);
        actions.success(list);
        return;
      }
      actions.success();
    } catch (err) {
      actions.error();
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchVideos(page);
  }, [pid, page]);

  return { state, fetchVideos, count, onChange, page, rowStart };
};

export default useGetVideo;
