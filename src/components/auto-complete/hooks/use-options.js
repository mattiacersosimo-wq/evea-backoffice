import { useEffect, useState } from "react";

const useOptions = (fetchData) => {
  const [options, setOptions] = useState([]);

  const getOptions = async () => {
    const data = await fetchData();
    if (data.length > 0) {
      setOptions(data);
    }
  };

  useEffect(() => {
    if (fetchData) {
      getOptions();
    }
  }, [fetchData]);

  return [options, getOptions];
};

export default useOptions;
