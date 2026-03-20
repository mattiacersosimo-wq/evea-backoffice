import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const StatusToggle = ({ reload }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      reload(1, {
        status: active ? "active" : null,
      });
    } else {
      reload(1);
    }
  }, [active]);

  const { t } = useTranslation();

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={active}
            onChange={(e) => {
              setActive(e.currentTarget.checked);
            }}
          />
        }
        label={t("user.subscriptions.active_only")}
        labelPlacement="start"
      />
    </FormGroup>
  );
};

export default StatusToggle;
