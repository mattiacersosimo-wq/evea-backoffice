import { CLEAR, LOAD } from "./types";

const subscriptionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOAD: {
      return payload;
    }
    case CLEAR: {
      return {};
    }
    default:
      return state;
  }
};

export default subscriptionReducer;
