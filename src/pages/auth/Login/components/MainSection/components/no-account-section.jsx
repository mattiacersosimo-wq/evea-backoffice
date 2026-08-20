import { Stack } from "@mui/material";
import useResponsive from "src/hooks/useResponsive";
import LanguagePopover from "src/layouts/shared/header/language-popover";

const NoAccountSection = () => {
  const smUp = useResponsive("up", "sm");

  return (
    !smUp && (
      <Stack mt={2} direction="row" alignItems="center" spacing={1}>
        <LanguagePopover />
      </Stack>
    )
  );
};

export default NoAccountSection;
