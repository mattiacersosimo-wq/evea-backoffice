import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";

const KEY = "NETWORK_SETTINGS_PAGE";

const useTabs = (defaultValues) => {
  const [currentTab, setCurrentTab] = useState(() => {
    const tab = sessionStorage.getItem(KEY);
    return tab ? tab : defaultValues || "";
  });

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(KEY);
    };
  }, []);

  return {
    currentTab,
    onChangeTab: (_, newValue) => {
      navigate(PATH_DASHBOARD.settings.network.view(newValue));
      setCurrentTab(newValue);
      sessionStorage.setItem(KEY, newValue);
    },

    setCurrentTab,
  };
};

export default useTabs;
