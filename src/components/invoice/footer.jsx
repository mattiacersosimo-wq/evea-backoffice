import { Grid, Link, Typography } from "@mui/material";
import { upperCase } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import Translate from "../translate";
import { PATH_USER } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";

const Footer = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  return (
    <Grid container>
      <Grid item xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">
          {upperCase(t("global.notes"))}
        </Typography>
        <Typography variant="body2">
          <Translate>user.online_store.my_orders.details.foot_note</Translate>
        </Typography>
      </Grid>
      <Grid item xs={12} md={3} sx={{ py: 3, textAlign: "right" }}>
        {isAdmin ? null : (
          <>
            <Typography variant="subtitle2">
              <Translate>
                user.online_store.my_orders.details.question
              </Translate>
            </Typography>
            <Typography variant="body2" target="_blank">
              <Link
                to={PATH_USER.helpCenter.createTicket.contactSupport}
                component={RouterLink}
              >
                support@cloudmlm.com
              </Link>
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Footer;
