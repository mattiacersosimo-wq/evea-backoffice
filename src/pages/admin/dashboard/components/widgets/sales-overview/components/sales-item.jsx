import { Box, Card, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import _data from "../_data";

const SalesItem = ({ amount, type }) => {
  const theme = useTheme();

  const { end_date, start_date, title, icon } = _data[type];

  return (
    <Grid item xs={12} md={6}>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "10px 7px",
          mt: "2px",
          borderRadius: "6px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "calc(100% - 35px)",
          }}
        >
          <Box
            sx={{
              width: "35px",
              height: "35px",
              borderRadius: "4px",
              bgcolor: theme.palette.widgets.blue[200],
              p: "7px",
            }}
          >
            <img src={icon} />
          </Box>

          <Box ml={1}>
            <Typography
              sx={{
                color: theme.palette.widgets.tertiary[600],
                fontSize: "15px",
                lineHeight: "1.5",
              }}
            >
              <Translate>{title}</Translate>
            </Typography>
            <Typography
              sx={{
                color: theme.palette.widgets.tertiary[600],
                fontSize: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight:300,
              }}
            >
              {start_date}
              {end_date ? ` - ${end_date}` : null}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: "14px" }}>
          <Currency>{amount}</Currency>
        </Typography>
      </Card>
    </Grid>
  );
};

export default SalesItem;
