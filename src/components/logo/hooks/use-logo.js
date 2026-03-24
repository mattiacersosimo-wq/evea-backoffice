import { useEffect, useState } from "react";

const EVEA_LOGO = "/logo/evea_logo.png";

const useGetLogo = () => {
  const [appLogo, setLogo] = useState(() => {
    const logo = localStorage.getItem("logo");
    if (logo) return logo;
    return EVEA_LOGO;
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

  return appLogo || EVEA_LOGO;
};

export default useGetLogo;
