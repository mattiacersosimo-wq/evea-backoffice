import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import fetchUser from "src/utils/fetchUser";

const useArticleGetById = (id) => {
//   const { id } = useParams();
  const [articleDetails, setArticleDetails] = useState([]);
  const fetchArticleDetails = async (id) => {
    try {
      const { status, data } = await fetchUser(`user-articles/${id}`);
      if (status) {
        setArticleDetails(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchArticleDetails(id);
  }, [id]);
  return {articleDetails,fetchArticleDetails};
};

export default useArticleGetById;
