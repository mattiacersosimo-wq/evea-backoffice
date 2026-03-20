import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import { Currency } from "src/components/with-prefix";
import { trim } from "src/pages/admin/store/productCategories/Components/ProductCategory";
import fetchUser from "src/utils/fetchUser";
import { fCurrency } from "src/utils/formatNumber";
import { load, useCartDispatch } from "../../store/cartStore";
import {
  changeSubscription,
  usePurchaseDispatch,
} from "../../store/purchaseStore";
import { fetchCart } from "./hooks/useCartList";

const updateSubscription = async (data) => {
  const reqData = new FormData();
  const { id, ...rest } = data;
  Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
  reqData.append("_method", "PUT");
  try {
    const { status } = await fetchUser.post(`cart/${id}`, reqData);
    return status === 200;
  } catch (err) {
    return false;
  }
};

const Item = ({ item, removeFromCart }) => {
  const { id, price, product, price_id } = item;
  const {
    name,
    short_description: description,
    product_prices: prices,
  } = product || {};
  const [subscription, setSubscription] = useState({
    id: "",
    price: "",
    product_id: "",
  });
  const cartDispatch = useCartDispatch();
  const dispatch = usePurchaseDispatch();

  const onSubscriptionChange = async (v) => {
    const data = JSON.parse(v);

    const status = await updateSubscription({
      id,
      product_id: data.product_id,
      price_id: data.id,
    });
    if (status) {
      const newCart = await fetchCart();

      cartDispatch(load(newCart));
      dispatch(
        changeSubscription({
          priceId: data.id,
          productId: data.product_id,
          prevPrice: subscription.id,
        })
      );
    }
    setSubscription(data);
  };
  return (
    <TableRow key={id}>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image
            alt="product image"
            src={item.product.product_images.find(Boolean)?.image_url}
            sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
          />
          <Box>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {trim(name)}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  {trim(description)}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>

      <TableCell align="left">
        <Currency>{price}</Currency>
      </TableCell>

      <TableCell align="left">
        <Subscriptions
          priceId={price_id}
          prices={prices}
          onChange={onSubscriptionChange}
        />
      </TableCell>

      <TableCell align="center">
        <IconButton onClick={() => removeFromCart(id)} name="delete">
          <Iconify icon={"eva:trash-2-outline"} width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Subscriptions = ({ prices, onChange, priceId }) => {
  const { price, id, product_id } = prices.find(({ id }) => id === priceId);
  const selected = JSON.stringify({ price, id, product_id });
  return (
    <>
      <Box sx={{ textAlign: "right" }}>
        <TextField
          label="Select Month"
          select
          sx={{ maxWidth: "75%" }}
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
              marginLeft: 2,
              width: "80%",
            },
          }}
          value={selected}
          onChange={(e) => onChange(e.target.value)}
        >
          {prices?.map(({ price, validity, id, product_id }) => (
            <option value={JSON.stringify({ price, id, product_id })} key={id}>
              {validity} month
            </option>
          ))}
        </TextField>
      </Box>
    </>
  );
};

export default Item;
