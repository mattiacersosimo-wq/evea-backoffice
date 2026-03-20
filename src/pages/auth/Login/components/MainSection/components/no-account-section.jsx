import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Translate from "src/components/translate";
import useResponsive from "src/hooks/useResponsive";
import LanguagePopover from "src/layouts/shared/header/language-popover";
import { PATH_AUTH } from "src/routes/paths";

const NoAccountSection = () => {
  const smUp = useResponsive("up", "sm");

  return (
    !smUp && (
      <Stack mt={2} direction="row" alignItems="center" spacing={1}>
        <LanguagePopover />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <Translate>register.don't_have</Translate>&nbsp;
          </Typography>
          <Link
            variant="subtitle2"
            component={RouterLink}
            to={PATH_AUTH.register}
          >
            <Translate>register.get_started</Translate>
          </Link>
        </Stack>
      </Stack>
    )
  );
};

export default NoAccountSection;
