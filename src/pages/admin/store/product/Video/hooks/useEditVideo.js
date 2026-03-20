import { useState } from "react";

const useEditVideo = () => {
  const [videoData, setVideoData] = useState(null);
  const openEdit = (item) => () => setVideoData(item);
  const closeEdit = () => setVideoData(null);

  return { videoData, openEdit, closeEdit };
};

export default useEditVideo;
