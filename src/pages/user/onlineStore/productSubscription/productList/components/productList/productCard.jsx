import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Image from "src/components/Image";
import Ternary from "src/components/ternary";
import { PATH_USER } from "src/routes/paths";
import useIsPackage from "../../../../../../../components/package-or-product/hooks/use-is-package";
import { ExistingUser, NewUser } from "./gift";
import ProductActions from "./productActions";
import Transition from "src/utils/dialog-animation";
import { Currency } from "src/components/with-prefix";

const ShopProductCard = ({ product }) => {
  const { name, product_image, product_url, product_prices } = product;
  const isPackage = useIsPackage();

  const linkTo = useMemo(() => {
    return isPackage
      ? PATH_USER.onlineStore.productSubscription.packages.view(product_url)
      : PATH_USER.onlineStore.productSubscription.products.view(product_url);
  }, [isPackage]);

  const [isUser, setIsUser] = useState(false);

  const [openGift, setOpenGift] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setOpenGift(false);
  };

  const onAddCart = () => {};

  return (
    <>
      <Card>
        <Box sx={{ position: "relative" }}>
          {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
          <Image alt={name} src={product_image} ratio="16/9" />
          {/* </Link> */}
        </Box>

        <CardContent>
          <Stack spacing={2}>
            {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
            >
              <Typography
                variant="subtitle2"
                sx={{ minHeight: 40, maxHeight: 40 }}
              >
                {name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ minHeight: 40, maxHeight: 40 }}
              >
                <Currency>{product_prices[0]?.price}</Currency>
              </Typography>
            </Box>
            {/* </Link> */}
            <ProductActions product={product} />
          </Stack>
        </CardContent>
      </Card>
      <Dialog
        open={openGift}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
      >
        <DialogTitle id="responsive-dialog-title">
          {"userOnlineStore.buyAs"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>{"userOnlineStore.doYouLike"}</Typography>
            <Checkbox checked={isUser} onClick={() => setIsUser(!isUser)} />
          </DialogContentText>
          <Ternary
            when={isUser}
            then={<ExistingUser onClose={handleClose} addToCart={onAddCart} />}
            otherwise={<NewUser onClose={handleClose} addToCard={onAddCart} />}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default ShopProductCard;
