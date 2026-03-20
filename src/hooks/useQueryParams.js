import { useLocation, useNavigate } from "react-router-dom";
import {
  encodeObjectToQueryString,
  parseQueryString,
} from "src/utils/queryString";

const useQueryParams = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const queryObject = parseQueryString(search);

  const handleNavigate = (obj) =>
    navigate(
      {
        pathname,
        search: encodeObjectToQueryString(obj),
      },
      { replace: true }
    );

  const addParam = (k, v) => {
    if (typeof k === "object") {
      handleNavigate({ ...queryObject, ...k });
      return;
    }

    handleNavigate({ ...queryObject, [k]: v });
  };

  const deleteParam = (...keys) => {
    const temp = { ...queryObject };
    keys.forEach((item) => delete temp[item]);
    handleNavigate(temp);
  };
  const clear = () => {
    handleNavigate({});
  };

  return { queryObject, addParam, deleteParam, clear };
};

export default useQueryParams;
