import makeStore from "src/utils/makeStore";
import {
  DESELECT_ALL_MAIL,
  SELECT_ALL_MAIL,
  SELECT_MAIL,
} from "./actionConstants";

const reducer = (state = [], { payload, type }) => {
  switch (type) {
    case SELECT_MAIL: {
      if (state) {
        if (state.includes(payload))
          return state.filter((id) => id !== payload);
        return [...state, payload];
      }

      return [payload];
    }
    case SELECT_ALL_MAIL: {
      return payload;
    }
    case DESELECT_ALL_MAIL: {
      return [];
    }
    default: {
      return [];
    }
  }
};

const {
  Provider: SelectedMailsProvider,
  useData,
  useDispatch,
} = makeStore(reducer, []);

export { useData as useSelectedMails };
export { useDispatch as useSelectedMailsDispatch };

export default SelectedMailsProvider;
