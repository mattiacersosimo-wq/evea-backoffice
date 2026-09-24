import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Scrollbar from "src/components/Scrollbar";
import Map from "src/components/map";

import { useCartData } from "../../store/cartStore";
import Item from "./Item";
import useRemoveFromCart from "./hooks/useRemoveFromCart";

const ProductList = () => {
  const { t } = useTranslation();
  const cartList = useCartData() || [];
  const removeFromCart = useRemoveFromCart();
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 720 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("global.product")} </TableCell>
              <TableCell align="left">{t("global.total_price")}</TableCell>
              <TableCell align="center">
                {t("global.subscription")}
              </TableCell>
              <TableCell align="center">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <Map
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
