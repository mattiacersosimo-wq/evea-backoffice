import { Button, Stack, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { useTheme } from "@mui/material/styles";


const ActionButtons = ({ name, id, addToCart, onBuyNow }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        backgroundColor: theme.palette.widgets.white[200],
        px: 1,
        py: 1,
        borderRadius: "4px",
      }}
    >
      <Button
        size="small"
        disableElevation
        onClick={onBuyNow}
        name="buy-now"
        startIcon={<Iconify icon="icon-park-outline:buy" />}
      >
        <Translate>user.online_store.buy_now</Translate>
      </Button>
      <Typography sx={{ color: "#b6b5b5" }}> | </Typography>
      <Button
        onClick={addToCart}
        size="small"
        startIcon={<Iconify icon={"bx:cart-add"} />}
        name="add-cart"
      >
        <Translate>user.online_store.cart</Translate>
      </Button>
    </Stack>
  );
};

export default ActionButtons;
