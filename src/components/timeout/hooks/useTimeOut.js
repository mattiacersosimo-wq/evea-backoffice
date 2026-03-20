import { useEffect, useState } from "react";

const useTimeOut = (length, timeout = 1000) => {
  const [timeOut, setTimeOut] = useState(false);

  useEffect(() => {
    const interval = setTimeout(() => {
      setTimeOut(length === 0);
    }, [timeout]);

    return () => clearInterval(interval);
  }, [length]);

  return [timeOut, setTimeOut];
};

export default useTimeOut;
