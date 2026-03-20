import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useMaterialCategories = () => {
  const [dataCategory, setDataCategory] = useState([]);
  const fetchDataCategory = async () => {
    const { status, data } = await axiosInstance(
      "/api/admin/material-categories?type=product"
    );

    if (status === 200) {
      setDataCategory(
        data.data.data.map(({ id, name }) => <option value={id}>{name}</option>)
      );
    }
  };
  useEffect(() => {
    fetchDataCategory();
  }, []);

  return dataCategory;
};

export default useMaterialCategories;
