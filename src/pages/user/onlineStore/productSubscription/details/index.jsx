import {
  Box,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { sentenceCase } from "change-case";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import CartWidget from "src/components/cartWidget";
import { SkeletonProduct } from "src/components/skeleton";
import Ternary from "src/components/ternary";

import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import useSettings from "src/hooks/useSettings";
import { PATH_USER } from "src/routes/paths";
import Summary from "./components/Summary";
import MoreInfo from "./components/moreInfo";
import DetailsCarousel from "./components/productCarousel";
import useGetProduct from "./hooks/useGetProduct";
import Transition from "src/utils/dialog-animation";

const ProductDetails = () => {
  const theme = useTheme();
  const { product } = useGetProduct();
  const { themeStretch } = useSettings();
  const { name = "" } = useParams();

  const handleClickOpenGift = () => {
    setOpenGift(true);
  };

  const handleClose = () => {
    setOpenGift(false);
  };

  const [isUser, setIsUser] = useState(false);
  const [openGift, setOpenGift] = useState(false);

  const images = product.product_images?.map((image) => image.image_url) || [];

  const productImages = [...images];

  const isPackage = useIsPackage();

  const linkTo = useMemo(() => {
    return isPackage
      ? PATH_USER.onlineStore.productSubscription.packages.root
      : PATH_USER.onlineStore.productSubscription.products.root;
  }, [isPackage]);

  const title = useMemo(() => {
    if (isPackage) {
      return "user.online_store.package_details.title";
    }
    return "user.online_store.product_details.title";
  }, [isPackage]);
  const subtitle = useMemo(() => {
    if (isPackage) {
      return "nav.store.packages";
    }
    return "nav.store.products";
  }, [isPackage]);

  return (
    <Page title={title}>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={title}
          links={[
            { name: "global.dashboard", href: PATH_USER.user_dashboard },
            {
              name: subtitle,
              href: linkTo,
            },
            { name: sentenceCase(name) },
          ]}
        />

        <CartWidget />
        <Ternary
          when={product}
          then={
            <>
              <Card>
                <Grid container>
                  <Grid item xs={12} md={6} lg={7}>
                    <DetailsCarousel images={productImages} />
                  </Grid>
                  <Grid item xs={12} md={6} lg={5}>
                    <Summary
                      product={product}
                      handleClickOpenGift={handleClickOpenGift}
                    />
                  </Grid>
                </Grid>
              </Card>

              <Box sx={{ mt: 4 }} />

              <MoreInfo product={product} />
            </>
          }
          otherwise={<SkeletonProduct />}
        />
      </Container>

      <Dialog
        open={openGift}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
      >
        <DialogTitle id="responsive-dialog-title">
          {"profuctDetails.buyAsGift"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>{"profuctDetails.existingUser"}</Typography>
            <Checkbox checked={isUser} onClick={() => setIsUser(!isUser)} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default ProductDetails;
