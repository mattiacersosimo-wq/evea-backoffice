import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import useResponsive from "src/hooks/useResponsive";
import LanguagePopover from "src/layouts/shared/header/language-popover";
import { PATH_AUTH } from "src/routes/paths";

const GetStartedTitle = ({ login = false }) => {
  const smUp = useResponsive("up", "sm");

  return (
    smUp && (
      <Stack direction="row" alignItems="center" spacing={2}>
        <LanguagePopover />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2">
            <Ternary
              when={login}
              then={<Translate>register.already</Translate>}
              otherwise={<Translate>register.don't_have</Translate>}
            />
            &nbsp;&nbsp;
          </Typography>
          {/* <Button
            disableElevation
            variant="contained"
            LinkComponent={RouterLink}
            to={login ? PATH_AUTH.login : PATH_AUTH.register}
          >
            <Ternary
              when={login}
              then={<Translate>register.login</Translate>}
              otherwise={<Translate>register.get_started</Translate>}
            />
          </Button> */}
        </Stack>
      </Stack>
    )
  );
};

export default GetStartedTitle;
