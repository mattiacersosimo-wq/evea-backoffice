import { useEffect, useState } from "react";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useCategoryOptions = () => {
  const [categories, setCategories] = useState([]);
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await axiosInstance.get(
          "api/admin/support-ticket-categories-list"
        );
        if (status === 200) {
          if (data.status) {
            setCategories(
              data.data.map(({ id, name }) => (
                <option value={id}>{name}</option>
              ))
            );
          }
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return categories;
};
export default useCategoryOptions;
