import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import Scrollbar from "src/components/Scrollbar";
import Loop from "src/components/loop";
import { useCartData } from "../../store/cartStore";
import Item from "./Item";
import useRemoveFromCart from "./hooks/useRemoveFromCart";
import { useTranslation } from "react-i18next";

const ProductList = ({ setCouponName }) => {
  const cartList = useCartData() || [];
  const removeFromCart = useRemoveFromCart();
  const { t } = useTranslation();
  setCouponName(cartList?.find(Boolean)?.coupon?.code);

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 720 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("user.online_store.product.product")} </TableCell>
              <TableCell align="center">
                {t("user.online_store.product.quantity")}
              </TableCell>
              <TableCell align="left">
                {t("user.online_store.product.price")}
              </TableCell>
              {/* <TableCell align="center">
                {t("user.online_store.product.subscription")}
              </TableCell> */}
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            <Loop
              list={cartList}
              render={(cartItem) => (
                <Item
                  key={cartItem.id}
                  item={cartItem}
                  removeFromCart={removeFromCart}
                />
              )}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

export default ProductList;
