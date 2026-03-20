import { Box, Card, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Currency } from "src/components/with-prefix";
import { twoPlaceRound } from "src/utils/round";

const Item = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { title, amount, percentage, icon } = data || {};
  return (
    <Card
      sx={{
        p: { lg: "25px 20px", md: "14px", xs: "14px" },

        pb: "25px !important",
      }}
    >
      <Grid container sx={{ alignItems: "center" }}>
        <Grid item sm={12} xs={4}>
          <Box
            sx={{
              backgroundColor: theme.palette.widgets.blue[200],
              borderRadius: "8px",
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={icon} width="35px" />
          </Box>
        </Grid>
        <Grid item sm={12} xs={8}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "15.5px",
              mt: 2,
              fontWeight: "400",
            }}
          >
            {t(title)}
          </Typography>

          <Typography variant="countText" mb={1} sx={{ fontSize: "21px" }}>
            <Currency>{amount}</Currency>
          </Typography>

          {/* <Box sx={{ fontSize: "14.5px" }}>
            <span
              style={{
                color:
                  percentage < 0
                    ? theme.palette.widgets.red[500]
                    : theme.palette.widgets.green[500],
              }}
            >
              {twoPlaceRound(percentage)}%
            </span>
            <Typography
              variant="subtitle3"
              style={{
                paddingLeft: "4px",
                fontWeight: "300",
              }}
            >
              {t("user_dashboard.incomeTitle")}
            </Typography>
          </Box> */}
        </Grid>
      </Grid>
    </Card>
  );
};

export default Item;
