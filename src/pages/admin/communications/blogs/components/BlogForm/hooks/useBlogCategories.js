import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useBlogCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await axiosInstance.get(
          "api/admin/blogs-category-names"
        );

        if (status === 200) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return { categories };
};

export default useBlogCategories;
