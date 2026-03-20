import { useEffect, useState } from "react";
import usePagination from "src/components/pagination/usePagination";
import useTimeOut from "src/components/timeout/hooks/useTimeOut";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useGetVideo = () => {
  const [videos, setVideos] = useState([]);
  const handleErrors = useErrors();
  const [timeOut, setTimeOut] = useTimeOut(videos.length);

  const { count, onChange, page, seed, rowStart } = usePagination();
  const fetchData = async (page = 1) => {
    setVideos([]);
    setTimeOut(false);
    try {
      const { status, data } = await await fetchUser(`user-videos`, {
        params: { page },
      });
      if (status) {
        const { data: video, last_page, from } = data.data;
        seed(last_page, from);
        setVideos(video);
      }
    } catch (err) {
      handleErrors(err);
    }
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  return { videos, page, count, onChange, rowStart, timeOut };
};
export default useGetVideo;
