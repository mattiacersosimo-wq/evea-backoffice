import { useEffect, useState } from "react";

const useGetLogo = () => {
  const [appLogo, setLogo] = useState(() => {
    const logo = localStorage.getItem("logo");
    if (logo) return logo;
    return null;
  });

  useEffect(() => {
    let interval = null;
    if (appLogo) return;
    interval = setInterval(() => {
      const logo = localStorage.getItem("logo");
      if (logo) {
        clearInterval(interval);
        setLogo(logo);
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return appLogo;
};

export default useGetLogo;
