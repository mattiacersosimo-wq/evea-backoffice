import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchUser from "src/utils/fetchUser";

const useFetchBlog = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const fetchData = async (id) => {
    try {
      const { status, data } = await (await fetchUser(`user-blogs/${id}`)).data;
      if (status) {
        setPost(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return post;
};

export default useFetchBlog;
