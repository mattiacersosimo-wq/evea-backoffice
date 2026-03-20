import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import { Currency } from "src/components/with-prefix";

import { useTranslation } from "react-i18next";
import HideForPackage from "src/components/package-or-product/hide-for-package";
import ShowForPackage from "src/components/package-or-product/show-for-package";
import Translate from "src/components/translate";
import { fShortenNumber } from "src/utils/formatNumber";
import useAddToCart from "../../hooks/useAddToCart";
import useBuyNow from "../hooks/useBuyNow";
import Vimeo from "@u-wave/react-vimeo";
import Transition from "src/utils/dialog-animation";

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

const useSelectPrice = (price) => {
  const [selectedPrice, setSelectedPrice] = useState({
    price: null,
    price_id: null,
  });

  useEffect(() => {
    if (!selectedPrice.price) {
      const defaultValue = price?.find(Boolean);
      if (defaultValue) {
        const { price, id } = defaultValue;
        setSelectedPrice({
          price: price,
          price_id: id,
        });
      }
    }
  }, [price]);

  const selectMonth = (e) => {
    setSelectedPrice(JSON.parse(e.target.value));
  };

  return { selectedPrice, selectMonth };
};

const Summary = ({ product, user_review, handleClickOpenGift, ...other }) => {
  // video
  const [videoOpen, setOpenVideo] = useState(false);

  const handleClickOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };
  // end video

  const addToCart = useAddToCart();
  const buyNow = useBuyNow();
  const {
    id,
    name,
    title,
    product_prices: price,
    short_description,
    user_reviews,
    product_sample_docs,
    product_videos,
    product_docs,
  } = product;
  const { selectedPrice, selectMonth } = useSelectPrice(price);
  const [review] = user_reviews || [];
  const [videos] = product_videos || [];

  const handleAddCart = () =>
    addToCart({
      ...selectedPrice,
      product_id: id,
    });

  const handleBuyNow = () =>
    buyNow({
      ...selectedPrice,
      product_id: id,
    });

  const { t } = useTranslation();
  return (
    <RootStyle {...other}>
      <Typography variant="h5">{name}</Typography>
      <Typography
        variant="caption"
        paragraph
        sx={{ color: "#637381", fontWeight: "400" }}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle2"
        paragraph
        sx={{ color: "#637381", fontWeight: "400" }}
      >
        {short_description}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Rating value={parseInt(review?.rating)} precision={0.1} readOnly />
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {t("global.review_other", {
            count: fShortenNumber(review?.review_count),
          })}
        </Typography>
      </Stack>
      <Typography variant="h4" sx={{ mb: 3 }}>
        <Currency>{selectedPrice.price}</Currency>
      </Typography>
      <Divider sx={{ borderStyle: "dashed" }} />
      <ShowForPackage>
        <Button
          onClick={handleBuyNow}
          fullWidth
          type="submit"
          variant="contained"
          name="buy-now"
        >
          <Translate>user.online_store.buy_now</Translate>
        </Button>
      </ShowForPackage>
      <HideForPackage>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mb: 3, my: 2 }}
        >
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            <Translate>user.online_store.subscription</Translate>
          </Typography>

          <TextField
            label={t("user.online_store.select_month")}
            select
            sx={{ maxWidth: "75%", ml: 2 }}
            fullWidth
            size="small"
            SelectProps={{ native: true }}
            InputLabelProps={{
              shrink: true,
            }}
            FormHelperTextProps={{
              sx: {
                textAlign: "right",
                margin: 0,
                mt: 1,
                ml: 2,
                width: "80%",
              },
            }}
            onChange={selectMonth}
            name="subscription-month"
          >
            <Map
              list={price}
              render={({ price, validity, id }) => (
                <option
                  value={JSON.stringify({ price, price_id: id })}
                  key={id}
                  name={validity}
                >
                  {validity} {t("global.month")}
                </option>
              )}
            />
          </TextField>
        </Stack>
      </HideForPackage>
      <Divider sx={{ borderStyle: "dashed" }} />

      <HideForPackage>
        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={"ic:round-add-shopping-cart"} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: "nowrap" }}
            name="add-cart"
          >
            <Translate>user.online_store.cart</Translate>
          </Button>

          <Button
            onClick={handleBuyNow}
            fullWidth
            type="submit"
            variant="contained"
            name="buy-now"
          >
            <Translate>user.online_store.buy_now</Translate>
          </Button>
        </Stack>
      </HideForPackage>
      <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
        <Ternary
          when={Boolean(product_docs?.length)}
          then={
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.open(product_docs?.find(Boolean)?.doc_url)}
            >
              <Translate>global.document</Translate>
            </Button>
          }
        />

        <Ternary
          when={Boolean(product_sample_docs?.length)}
          then={
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                window.open(product_sample_docs?.find(Boolean)?.sample_doc_url)
              }
            >
              <Translate>global.sample_document</Translate>
            </Button>
          }
        />
        <Ternary
          when={Boolean(product_videos?.length)}
          then={
            <Button
              size="small"
              variant="outlined"
              onClick={handleClickOpenVideo}
            >
              Video
            </Button>
          }
        />
      </Stack>
      <Dialog
        fullWidth
        open={videoOpen}
        onClose={handleCloseVideo}
        TransitionComponent={Transition}
      >
        <Box textAlign="right" sx={{ backgroundColor: "#000" }}>
          <Tooltip title="Copy">
            <IconButton onClick={handleCloseVideo}>
              <Iconify
                icon={"eva:close-outline"}
                width={24}
                height={24}
                sx={{ color: "#fff" }}
              />
            </IconButton>
          </Tooltip>
          <Vimeo video={videos?.video_url} controls responsive />
        </Box>
      </Dialog>
    </RootStyle>
  );
};

Summary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.shape({
    available: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    cover: PropTypes.string,
    id: PropTypes.string,
    inventoryType: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
  }),
};

const Incrementer = ({
  available,
  quantity,
  onIncrementQuantity,
  onDecrementQuantity,
}) => {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        borderColor: "grey.50032",
      }}
    >
      <IconButton
        size="small"
        color="inherit"
        disabled={quantity <= 1}
        onClick={onDecrementQuantity}
      >
        <Iconify icon={"eva:minus-fill"} width={14} height={14} />
      </IconButton>

      <Typography
        variant="body2"
        component="span"
        sx={{ width: 40, textAlign: "center" }}
      >
        {quantity}
      </Typography>

      <IconButton
        size="small"
        color="inherit"
        disabled={quantity >= available}
        onClick={onIncrementQuantity}
      >
        <Iconify icon={"eva:plus-fill"} width={14} height={14} />
      </IconButton>
    </Box>
  );
};

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

export default Summary;
