import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { FormProvider, RHFSelect } from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import { fCurrency } from "src/utils/formatNumber";

CheckoutProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

export default function CheckoutProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Subscription</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => {
            const { id, name, price, cover, quantity, available } = product;
            return (
              <TableRow key={id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Image
                      alt="product image"
                      src={cover}
                      sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        noWrap
                        variant="subtitle2"
                        sx={{ maxWidth: 240 }}
                      >
                        {name}
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
                            In publishing and graphic design...
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="left">{fCurrency(price)}</TableCell>

                <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    available={available}
                    onDecrease={() => onDecreaseQuantity(id)}
                    onIncrease={() => onIncreaseQuantity(id)}
                  />
                </TableCell>

                <TableCell align="right">
                  {fCurrency(price * quantity)}
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => onDelete(id)} name="delete">
                    <Iconify
                      icon={"eva:trash-2-outline"}
                      width={20}
                      height={20}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  const methods = useForm();
  const onSubmit = methods.handleSubmit((inputData) => {});
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ textAlign: "right" }}>
          <RHFSelect name="active" label="Select Month" size="small">
            <option value="1">1 Month</option>
            <option value="0">2 Month</option>
          </RHFSelect>
        </Box>
      </FormProvider>
    </>
  );
}
