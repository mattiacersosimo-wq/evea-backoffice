import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useSubScriptionCategories = (open) => {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          "api/admin/product-subscription-category-names"
        );

        if (status === 200) {
          setCategoryList(
            data.data.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (open) fetchData();
  }, [open]);

  return categoryList;
};

export default useSubScriptionCategories;
