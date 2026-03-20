import sum from "lodash/sum";
import makeStore from "src/utils/makeStore";

const defaultPurchaseData = {
  date: new Date().toLocaleDateString("en-GB"),
  total_amount: "",
  payment_type_id: "",
  product_id: [],
  product_price_id: [],
  actualPrices: "",
  cart_id: [],
  is_subscription: false,
  is_package: false,
};

// Action Constants
const LOAD = "LOAD";
const HANDLE_SUBSCRIPTION_CHANGE = "HANDLE_SUBSCRIPTION_CHANGE";
const SET_PAYMENT_TYPE = "SET_PAYMENT_TYPE";

// Actions
export const load = (payload) => ({ type: LOAD, payload });
export const changeSubscription = (payload) => ({
  type: HANDLE_SUBSCRIPTION_CHANGE,
  payload,
});

export const setPaymentType = (payload) => ({
  type: SET_PAYMENT_TYPE,
  payload,
});
const reducer = (state = defaultPurchaseData, { type, payload }) => {
  switch (type) {
    case LOAD: {
      const priceList = [];
      const productList = [];
      const cartList = [];
      payload.forEach((item) => {
        priceList.push(item.price_id);
        productList.push(item.product_id);
        cartList.push(item.id);
      });

      return {
        date: new Date().toLocaleDateString("en-GB"),
        actualPrices: sum(
          payload.map(({ item_sub_total }) => parseFloat(item_sub_total)),
        ),
        total_amount: sum(payload.map(({ price }) => parseFloat(price || 0))),
        product_id: productList,
        product_price_id: priceList,
        cart_id: cartList,
        is_subscription: payload.some(({ is_subscription }) => is_subscription),
        is_package: payload.some(({ is_package }) => is_package),
      };
    }

    case HANDLE_SUBSCRIPTION_CHANGE: {
      const { product_id, product_price_id } = state;

      const isProductIdAdded = product_id.findIndex(
        (id) => id === payload.productId
      );
      if (isProductIdAdded < 0) {
        return {
          ...state,
          product_id: [...product_id, payload.productId],
          product_price_id: [...product_price_id, payload.priceId],
        };
      }
      const newArray = product_price_id.map((item) =>
        item === payload.prevPrice ? payload.priceId : item
      );

      return { ...state, product_price_id: newArray };
    }

    case SET_PAYMENT_TYPE: {
      return { ...state, payment_type_id: payload };
    }

    default: {
      return state;
    }
  }
};

const {
  Provider: PurchaseProvider,
  useData: usePurchaseData,
  useDispatch: usePurchaseDispatch,
} = makeStore(reducer, defaultPurchaseData);

export { usePurchaseData, usePurchaseDispatch };

export default PurchaseProvider;
