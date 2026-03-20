import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryTabs = (defaultValue = "", name = "tab") => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = searchParams.get(name) || defaultValue;

  const getNewSearchObject = (v) => {
    return {
      ...Object.fromEntries([...searchParams.entries()]),
      [name]: v,
    };
  };

  useEffect(() => {
    if (!selected) {
      setSearchParams(getNewSearchObject(defaultValue));
    }
  }, [selected]);

  const onChangeTab = (_, v) => {
    setSearchParams(getNewSearchObject(v));
  };

  return [selected, onChangeTab];
};

export default useQueryTabs;
