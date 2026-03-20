import { useEffect, useState } from "react";
import { useParams } from "react-router";
import usePagination from "src/components/pagination/usePagination";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useFetch = (url) => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const { count, onChange, page, rowStart, seed } = usePagination();

  const handleErrors = useErrors();
  const fetchData = async () => {
    try {
      const { status, data } = await (
        await fetchUser(`my-subscriptions-${url}/${id}`)
      ).data;

      if (status) {
        setCategories(data.categories);
        const { data: list, last_page, from } = data.data;
        seed(last_page, from);
        setData(list);
        return;
      }
      setData([]);
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  return { data, categories, count, onChange, page, rowStart };
};

export default useFetch;
