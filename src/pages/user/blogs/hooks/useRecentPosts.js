import { useEffect, useState } from "react";
import fetchUser from "src/utils/fetchUser";

const useGetRecentPosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const { data, status } = await (
        await fetchUser("user-recent-blogs")
      ).data;
      if (status) {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts };
};

export default useGetRecentPosts;
