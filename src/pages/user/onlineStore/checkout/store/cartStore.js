import makeStore from "src/utils/makeStore";

const LOAD = "LOAD";
const CLEAR = "CLEAR";
const DELETE = "DELETE";
export const clear = () => ({ type: CLEAR });
export const load = (payload) => ({ type: LOAD, payload });
export const remove = (payload) => ({ type: DELETE, payload });

const reducer = (state = [], { type, payload }) => {
  switch (type) {
    case LOAD: {
      return payload;
    }
    case CLEAR: {
      return [];
    }
    case DELETE: {
      const notDeleted = state.filter(({ id }) => id !== payload);
      return notDeleted;
    }
    default: {
      return state;
    }
  }
};

const {
  Provider: CartProvider,
  useData: useCartData,
  useDispatch: useCartDispatch,
} = makeStore(reducer, []);

export { useCartData, useCartDispatch };
export default CartProvider;
