import { useEffect } from "react";
import useTabs from "./useTabs";

const useCustomTabs = (key, defaultValue = "") => {
  const { currentTab, onChangeTab } = useTabs(
    localStorage.getItem(key) || defaultValue
  );

  useEffect(() => () => localStorage.setItem(key, defaultValue), []);

  useEffect(() => localStorage.setItem(key, currentTab), [currentTab]);

  return { currentTab, onChangeTab };
};

export default useCustomTabs;
