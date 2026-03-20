import { useTheme } from "@mui/material/styles";

const useIsDarkMode = () => {
  const { palette } = useTheme();
  return palette.mode === "dark";
};

export default useIsDarkMode;
