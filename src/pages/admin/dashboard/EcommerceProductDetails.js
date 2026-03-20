import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Tab,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CartWidget from "src/components/cartWidget";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Markdown from "src/components/Markdown";
import Page from "src/components/Page";
import { SkeletonProduct } from "src/components/skeleton";
import useSettings from "src/hooks/useSettings";
import { addCart, onGotoStep } from "src/redux/slices/product";
import { useDispatch, useSelector } from "src/redux/store";
import { PATH_USER } from "src/routes/paths";
import {
  ProductDetailsCarousel,
  ProductDetailsReview,
  ProductDetailsSummary,
} from "src/sections/@dashboard/e-commerce/product-details";
import {
  ExistingUser,
  NewUser,
} from "src/sections/@dashboard/e-commerce/shop/gift";
import Transition from "src/utils/dialog-animation";
import fetchUser from "src/utils/fetchUser";

const useGetProduct = () => {
  const {
    state: { pid },
  } = useLocation();
  const [product, setProduct] = useState({ images: [], colors: ["#000"] });

  const fetchProducts = async () => {
    try {
      const { status, data } = await fetchUser(`online-store/${pid}`);
      if (status === 200) {
        setProduct(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pid]);

  return { product, fetchProducts };
};

export default function EcommerceProductDetails() {
  const theme = useTheme();
  const { product, fetchProducts } = useGetProduct();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const { name = "" } = useParams();
  const { error, checkout } = useSelector((state) => state.product);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const handleClickOpenGift = () => {
    setOpenGift(true);
  };

  const handleClose = () => {
    setOpenGift(false);
  };

  const onAddCart = () => {
    handleAddCart({
      ...product,
      quantity: 1,
      subtotal: product.price,
    });
  };

  const [isUser, setIsUser] = useState(false);
  const [openGift, setOpenGift] = useState(false);

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: "Dashboard", href: PATH_USER.user_dashboard },
            {
              name: "Product Subscription",
              href: PATH_USER.onlineStore.productSubscription.root,
            },
            { name: sentenceCase(name) },
          ]}
        />

        <CartWidget />

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                    handleClickOpenGift={handleClickOpenGift}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ mt: 4 }} />

            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: "background.neutral" }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab disableRipple value="2" label="Questions" />
                    <Tab
                      disableRipple
                      value="3"
                      label={`Review (${product.reviews?.length})`}
                      sx={{ "& .MuiTab-wrapper": { whiteSpace: "nowrap" } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Typography variant="subtitle2">
                      In publishing and graphic design, Lorem ipsum is a
                      placeholder text commonly used to demonstrate the visual
                      form of a document or a typeface without relying on
                      meaningful content. Lorem ipsum may be used as a
                      placeholder before final copy is available.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 3 }}>
                      In publishing and graphic design, Lorem ipsum is a
                      placeholder text commonly used to ..
                    </Typography>
                    <Typography variant="subtitle2">
                      In publishing and graphic design, Lorem ipsum is a
                      placeholder text commonly used to demonstrate the visual
                      form of a document or a typeface without relying on
                      meaningful content. Lorem ipsum may be used as a
                      placeholder before final copy is available.Lorem ipsum may
                      be used as a placeholder before final copy.
                    </Typography>
                  </Box>
                </TabPanel>

                <TabPanel value="2">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="3">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!product && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>

      <Dialog
        open={openGift}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
      >
        <DialogTitle id="responsive-dialog-title">
          Buy As Gift - Product Name
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>Existing User</Typography>
            <Checkbox checked={isUser} onClick={() => setIsUser(!isUser)} />
          </DialogContentText>
          {isUser ? (
            <ExistingUser onClose={handleClose} addToCart={onAddCart} />
          ) : (
            <NewUser onClose={handleClose} addToCard={onAddCart} />
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}
