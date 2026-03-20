import axiosInstance from "src/utils/axios";
import useSubscriptionForm from "../../../hooks/use-category-form";

const useGetById = () => {
  const methods = useSubscriptionForm();
  const fetchSubscriptionCategoryById = async (id) => {
    try {
      const { status, data } = await axiosInstance.get(
        `api/admin/product-subscription-categories/${id}`
      );
      if (status === 200) {
        const { description, name } = data.data;
        methods.reset({ description, name });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { fetchSubscriptionCategoryById, methods };
};

export default useGetById;
