import makeStore from "src/utils/makeStore";
import { LOAD } from "./actionConstants";

const initialState = {
  id: null,
  material_docs: [],
  material_videos: [],
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD: {
      return payload;
    }
    default: {
      return state;
    }
  }
};

const {
  Provider: MaterialsProvider,
  useData,
  useDispatch,
} = makeStore(reducer, initialState);

export { useData as useMaterialsStore };
export { useDispatch as useMaterialsDispatch };

export default MaterialsProvider;
