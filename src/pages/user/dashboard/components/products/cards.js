import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Box,
  Button,
  Card,
  CardHeader,
  Link,
  Stack,
  Typography,
} from "@mui/material";
// utils
import { fCurrency } from "src/utils/formatNumber";
// _mock_
import { _ecommerceLatestProducts } from "src/_mock";
//
import { ColorPreview } from "src/components/color-utils";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import Scrollbar from "src/components/Scrollbar";

// ----------------------------------------------------------------------

export default function ProductList() {
  return (
    <Card>
      <CardHeader title="Products" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {_ecommerceLatestProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
        <Box sx={{ p: 1, textAlign: "right" }}>
          <Button
            to="#"
            size="small"
            color="info"
            endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
          >
            View All hii
          </Button>
        </Box>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProductItem.propTypes = {
  product: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
  }),
};

function ProductItem({ product }) {
  const { name, image, price, priceSale } = product;
  const hasSale = priceSale > 0;

  return (
    <Stack direction="row" spacing={2}>
      <Image
        alt={name}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <Link
          component={RouterLink}
          to="#"
          sx={{ color: "text.primary", typography: "subtitle2" }}
        >
          {name}
        </Link>

        <Stack direction="row">
          {hasSale && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textDecoration: "line-through" }}
            >
              {fCurrency(priceSale)}
            </Typography>
          )}
          &nbsp;
          <Typography
            variant="body2"
            sx={{ color: priceSale ? "error.main" : "text.secondary" }}
          >
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Box>

      <Box>
        <Button
          variant="contained"
          size="small"
          color="info"
          endIcon={<Iconify icon={"ei:cart"} />}
        >
          Buy Now
        </Button>
      </Box>
      <Box>
        <Button
          size="small"
          color="info"
          endIcon={<Iconify icon={"carbon:view"} />}
        >
          View
        </Button>
      </Box>
    </Stack>
  );
}
