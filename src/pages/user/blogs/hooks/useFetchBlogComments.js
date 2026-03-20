import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useFetchBlogComments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const handleErrors = useErrors();

  const fetchData = async (id) => {
    try {
      const { status, data } = await (
        await fetchUser(`user-blogcomments/${id}`)
      ).data;
      if (status) {
        setComments(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return { comments, fetchData };
};

export default useFetchBlogComments;
