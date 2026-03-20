import { createSearchParams, useSearchParams } from "react-router-dom";

const useToggle = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDense = searchParams.get("isDense");
  const handleToggleDense = () => {
    if (Boolean(parseInt(isDense))) {
      setSearchParams(createSearchParams({ isDense: 0 }));
    } else {
      setSearchParams(createSearchParams({ isDense: 1 }));
    }
  };

  return handleToggleDense;
};

export default useToggle;
