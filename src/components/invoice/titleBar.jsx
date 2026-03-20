import { Box, Grid, Typography } from "@mui/material";

import useAuth from "src/hooks/useAuth";
import ParseDate from "../date";
import Logo from "../logo";
import Translate from "../translate";

const TitleBar = ({ date, invoiceNumber, email }) => {
  const { isAdmin } = useAuth();
  return (
    <Grid container>
      <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
        <Logo />
      </Grid>

      <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
        <Box sx={{ textAlign: { sm: "right" } }}>
          <Typography variant="h6">{invoiceNumber}</Typography>
          {isAdmin ? (
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "text.disabled" }}
            >
              EMAIL &nbsp;:&nbsp;&nbsp;
              <span>{email ?? "_"}</span>
            </Typography>
          ) : null}

          <Typography variant="overline" sx={{ color: "text.disabled" }}>
            <Translate>
              user.online_store.my_orders.details.invoiced_date
            </Translate>
            &nbsp;:&nbsp;&nbsp; <ParseDate date={date} />
          </Typography>
          <br />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TitleBar;
