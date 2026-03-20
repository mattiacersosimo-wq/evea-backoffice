import { createContext, useContext, useReducer } from "react";

const makeStore = (reducer, initialState, init = () => null) => {
  const dataContext = createContext(initialState);
  const dispatchContext = createContext(() => null);
  const Provider = ({ children }) => {
    const [data, dispatch] = useReducer(reducer, initialState, init);
    return (
      <dataContext.Provider value={data}>
        <dispatchContext.Provider value={dispatch}>
          {children}
        </dispatchContext.Provider>
      </dataContext.Provider>
    );
  };

  const useData = () => useContext(dataContext);
  const useDispatch = () => useContext(dispatchContext);

  return { Provider, useData, useDispatch };
};

export default makeStore;
