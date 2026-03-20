import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useCategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategoryList = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        "/api/admin/faq-categories-names"
      );
      if (status === 200) {
        setCategoryList(
          data.data.map((item) => <option value={item.id}>{item.name}</option>)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return categoryList;
};

export default useCategoryList;
