import { useSnackbar } from "notistack";
import useAuth from "src/hooks/useAuth";
import fetchUser from "src/utils/fetchUser";
import { remove, useCartDispatch } from "../../../store/cartStore";

const useRemoveFromCart = () => {
  const { decrementCart } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useCartDispatch();
  return async (id) => {
    const reqData = new FormData();
    reqData.append("_method", "DELETE");

    try {
      const { data } = await fetchUser.post(`cart/${id}`, reqData);
      const { status, data: deletedItem } = data;
      if (status) {
        dispatch(remove(deletedItem.id));
        enqueueSnackbar(data.message);
        decrementCart(data.data.length);
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export default useRemoveFromCart;
