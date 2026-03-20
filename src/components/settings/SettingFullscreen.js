import { Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

import Iconify from "../Iconify";
import Ternary from "../ternary";
import Translate from "../translate";

export default function SettingFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={fullscreen ? "primary" : "inherit"}
      startIcon={
        <Iconify
          icon={fullscreen ? "ic:round-fullscreen-exit" : "ic:round-fullscreen"}
        />
      }
      onClick={toggleFullScreen}
      sx={{
        fontSize: 14,
        ...(fullscreen && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
        }),
      }}
    >
      <Ternary
        when={fullscreen}
        then={<Translate>settings.full_screen.exit</Translate>}
        otherwise={<Translate>settings.full_screen.enter</Translate>}
      />
    </Button>
  );
}
