import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { paramCase } from "change-case";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Image from "src/components/Image";
import Scrollbar from "src/components/Scrollbar";
import EmptyTable from "src/components/emptyTable";
import { Currency } from "src/components/with-prefix/index.jsx";

import useAddToCart from "src/pages/user/onlineStore/productSubscription/hooks/useAddToCart";
import useProducts from "src/pages/user/onlineStore/productSubscription/productList/hooks/useProducts";
import { PATH_USER } from "src/routes/paths";

const useProductList = () => {
  const { state } = useProducts();
  const { data: newData } = state;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(newData.splice(0, 4));
  }, [newData]);

  return newData;
};

const ProductList = () => {
  const products = useProductList();
  const isEmpty = !Boolean(products?.length);
  return (
    <Card sx={{ mt: 2, borderRadius: "7px" }}>
      <CardHeader
        title={
          <Typography variant="subtitle2">
            {"userDashboard.products"}
          </Typography>
        }
      />
      {isEmpty ? (
        <EmptyTable />
      ) : (
        <Box>
          {products.slice(0, 5).map((product) => (
            <NewsItem key={product.id} product={product} />
          ))}
        </Box>
      )}

      <Divider />

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="primary"
          component={RouterLink}
          to={PATH_USER.onlineStore.productSubscription.root}
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
          name="view"
        >
          {"viewAll"}
        </Button>
      </Box>
    </Card>
  );
};

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
};

function NewsItem({ product }) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const {
    id,
    name: title,
    short_description: description,
    product_images: image,
    product_prices: price,
  } = product;

  const linkTo = PATH_USER.onlineStore.productSubscription.view(
    paramCase(title)
  );
  const { palette } = useTheme();
  return (
    <>
      <>
        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
            <Stack direction="row" spacing={2}>
              <Image
                alt={title}
                src={image[0]?.image_url}
                sx={{ width: 80, height: 80, borderRadius: 1.5, flexShrink: 0 }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{ color: "text.primary", typography: "subtitle2" }}
                >
                  {title}
                </Typography>
                <Stack direction="row">
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                    overline
                    className="blogCntnt"
                  >
                    {description}
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    display: "grid",
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                    },
                  }}
                >
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<Iconify icon="carbon:view" />}
                    color="primary"
                    size="small"
                    sx={{
                      backgroundColor: palette.primary.lighter,
                      height: "fit-content",
                    }}
                    onClick={() => navigate(linkTo, { state: { pid: id } })}
                    name="view"
                  >
                    {"view"}
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon={"iconoir:add-to-cart"} />}
                    onClick={() => {
                      const { price: amount, product_id, id } = price[0];
                      addToCart({ price: amount, product_id, price_id: id });
                    }}
                    name="add"
                  >
                    {"userDashboard.addCart"}
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ marginRight: "3rem !important" }} fontWeight={600}>
                <Currency>{price[0]?.price}</Currency>
              </Box>
            </Stack>
          </Stack>
        </Scrollbar>
      </>
    </>
  );
}

export default ProductList;
