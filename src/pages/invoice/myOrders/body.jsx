import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  "& td": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const InvoiceBody = ({ invoice }) => {
  const {
    total_amount: totalPrice,
    discount_amount: discount,
    sub_total,
    item_sub_total,
    user_payment,
    shipping_charge,
    total_bv,
    total_qv,
    total_ev,
    coupon_amount,
    consecutive_discount_amount,
  } = invoice || {};

  const isProductPurchase = useMemo(() => {
    return Boolean(user_payment?.purchase_type === "online_store");
  }, [user_payment?.purchase_type]);

  return (
    <TableBody>
      <Ternary
        when={user_payment?.purchase_type === "coupon_purchase"}
        then={
          <TableRow
            sx={{
              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            <TableCell>{1}</TableCell>
            <TableCell align="left">
              <Box sx={{ maxWidth: 560 }}>
                <Typography variant="subtitle2">Coupon Purchase</Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  noWrap
                >
                  {user_payment?.payment_type?.payment_status}
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="left">
              {user_payment?.payment_type?.name}
            </TableCell>

            <TableCell align="left">
              <Currency>{user_payment?.amount}</Currency>
            </TableCell>
            <TableCell align="left"> - </TableCell>
          </TableRow>
        }
        otherwise={
          <Map
            list={user_payment?.carts}
            render={(row, index) => (
              <TableRow
                key={index}
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell align="left">
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">
                      {row?.product?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {user_payment?.payment_type?.payment_status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {user_payment?.payment_type?.name}
                </TableCell>

                <TableCell align="left">
                  <Currency>{row?.actual_price}</Currency>
                </TableCell>
                <TableCell align="left">{row?.quantity}</TableCell>
                <TableCell align="left">{row?.prices?.total_cv}</TableCell>
                <TableCell align="left">{row?.prices?.total_qv}</TableCell>
                <TableCell align="left">{row?.prices?.total_ev}</TableCell>
                <TableCell align="left">
                  <Currency>{row?.product_total}</Currency>
                </TableCell>
              </TableRow>
            )}
          />
        }
      />

      <Ternary
        when={isProductPurchase}
        then={
          <>
            <RowResultStyle>
              <TableCell colSpan={7} />
              <TableCell align="left" sx={{ pr: 2 }}>
                <Typography>
                  <Translate>
                    user.online_store.my_orders.invoice_details.sub_total
                  </Translate>
                </Typography>
              </TableCell>

              <TableCell align="left">
                <Typography>
                  <Currency>{item_sub_total}</Currency>
                </Typography>
              </TableCell>
            </RowResultStyle>
          </>
        }
      />

      {/* <RowResultStyle>
        <TableCell colSpan={6} />
        <TableCell align="right">
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.discount
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography sx={{ color: "error.main" }}>
            <Currency>{discount}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle> */}
      {/* <RowResultStyle>
        <TableCell colSpan={6} />
        <TableCell align="right">
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.total_bv
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography sx={{ color: "error.main" }}>
            <Currency>{total_bv}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>
      <RowResultStyle>
        <TableCell colSpan={6} />
        <TableCell align="right">
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.total_qv
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography sx={{ color: "error.main" }}>
            <Currency>{total_qv}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>
      <RowResultStyle>
        <TableCell colSpan={6} />
        <TableCell align="right">
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.total_ev
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="right" width={120}>
          <Typography sx={{ color: "error.main" }}>
            <Currency>{total_ev}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle> */}
      <RowResultStyle>
        <TableCell colSpan={7} />
        <TableCell align="left" sx={{ pr: 2 }}>
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.coupon_discount
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography sx={{ color: "success.main" }}>
            <Currency>{user_payment?.coupon_amount}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>
      <RowResultStyle>
        <TableCell colSpan={7} />
        <TableCell align="left" sx={{ pr: 2 }}>
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.consequtive
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography sx={{ color: "success.main" }}>
            <Currency>{user_payment?.consecutive_discount_amount}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>
      <RowResultStyle>
        <TableCell colSpan={7} />
        <TableCell align="left" sx={{ pr: 2 }}>
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.shipping
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography sx={{ color: "error.main" }}>
            <Currency>{shipping_charge}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>

      <RowResultStyle>
        <TableCell colSpan={7} />
        <TableCell align="left" sx={{ pr: 2 }}>
          <Typography>
            <Translate>
              user.online_store.my_orders.invoice_details.iva_price
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>
            <Currency>{user_payment?.tax_total}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>

      <RowResultStyle>
        <TableCell colSpan={7} />
        <TableCell align="left" sx={{ pr: 2 }}>
          <Typography variant="h6">
            <Translate>
              user.online_store.my_orders.invoice_details.total
            </Translate>
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="h6">
            <Currency>{totalPrice}</Currency>
          </Typography>
        </TableCell>
        <TableCell />
      </RowResultStyle>
    </TableBody>
  );
};

export default InvoiceBody;
