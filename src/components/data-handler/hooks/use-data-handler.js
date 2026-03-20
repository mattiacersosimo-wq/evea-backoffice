import { useState } from "react";

export const defaultHandlerData = {
  loading: false,
  error: false,
  data: [],
  isArrayEmpty: true,
};

const useDataHandler = (defaultState = null) => {
  const [state, setState] = useState(() => {
    if (defaultState) {
      return { ...defaultHandlerData, data: defaultState };
    }
    return defaultHandlerData;
  });

  const actions = {
    loading: () => {
      if (defaultState) {
        setState({ ...defaultHandlerData, data: defaultState, loading: true });
      } else {
        setState({ ...defaultHandlerData, loading: true });
      }
    },

    success: (data = [], isObject = false) => {
      if (isObject) {
        setState({
          ...defaultHandlerData,
          data,
          isArrayEmpty: Object.keys(data).length === 0,
        });
      } else {
        setState({
          ...defaultHandlerData,
          data,
          isArrayEmpty: data.length === 0,
        });
      }
    },

    error: () => {
      if (defaultState) {
        setState({ ...defaultHandlerData, data: defaultState, error: true });
      } else {
        setState({ ...defaultHandlerData, error: true });
      }
    },

    reset: () => setState(defaultHandlerData),
  };

  return [state, actions];
};

export default useDataHandler;
