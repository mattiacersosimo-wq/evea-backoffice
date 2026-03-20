import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useCategoryNames = () => {
  const [articleCategoryNames, setCategoryNames] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance(
          "api/admin/article-category-names"
        );

        if (status === 200 && Boolean(data.data)) {
          setCategoryNames(data.data);
          return;
        }
        setCategoryNames([]);
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchData();
  }, []);

  return articleCategoryNames;
};

export default useCategoryNames;
