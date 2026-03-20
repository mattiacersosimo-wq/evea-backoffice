import { useState } from "react";
import axiosInstance from "src/utils/axios";

const useChangeStatus = (active) => {
  const [isActive, setIsActive] = useState(Boolean(active));

  const changeStatus = async (id) => {
    try {
      const { status } = await axiosInstance.get(
        `/api/admin/product-status/${id}`
      );
      if (status === 200) {
        setIsActive(!isActive);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { isActive, changeStatus };
};

export default useChangeStatus;
