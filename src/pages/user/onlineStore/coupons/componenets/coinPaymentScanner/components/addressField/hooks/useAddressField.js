import { useEffect, useState } from "react";

const useAddressField = () => {
  const [showToolTip, setShowToolTip] = useState(false);
  const copyAddress = (text) => () => {
    navigator.clipboard.writeText(text);
    setShowToolTip(true);
  };

  useEffect(() => {
    if (showToolTip) {
      setTimeout(() => {
        setShowToolTip(false);
      }, 1000);
    }
  }, [showToolTip]);

  return { showToolTip, copyAddress };
};

export default useAddressField;
