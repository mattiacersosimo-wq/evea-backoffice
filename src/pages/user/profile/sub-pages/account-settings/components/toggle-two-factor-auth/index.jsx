import { Box, Card, Chip, Switch, Typography } from "@mui/material";
import { useState } from "react";
import useAuth from "src/hooks/useAuth";

import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import Disable from "./components/disable";
import Enable from "./components/enable";

const ToggleTwoFactorAuth = () => {
  const { user } = useAuth();
  const isImpersonate = localStorage.getItem("isImpersonate");

  const isEnabled = Boolean(parseInt(user.google2fa_secret_url));
  const [dialog, setDialog] = useState(null);

  return (
    <Card sx={{ p: 3, mt: 1 }}>
      <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
        <Translate>profile.settings.2fa.title</Translate>
      </Typography>
      <Box>
        <Ternary
          when={isImpersonate}
          then={
            <Chip
              label={
                <medium>
                  <Translate>global.impersonateText</Translate>
                </medium>
              }
              size="small"
              color="warning"
              variant="outlined"
              deleteIcon={<Iconify icon="ic:baseline-done" />}
              sx={{ marginLeft: 1 }}
            />
          }
        />
      </Box>

      <Switch
        disabled={isImpersonate}
        checked={isEnabled}
        name="twofa"
        label="Two Step Authentication"
        onChange={() => setDialog(isEnabled ? "disable" : "enable")}
      />
      <Disable open={dialog === "disable"} onClose={() => setDialog(null)} />
      <Enable open={dialog === "enable"} onClose={() => setDialog(null)} />
    </Card>
  );
};

export default ToggleTwoFactorAuth;
