import { LOAD } from "./types";

const planReducer = (state = null, { type, payload }) => {
  switch (type) {
    case LOAD:
      return payload;

    default:
      return state;
  }
};

export default planReducer;
