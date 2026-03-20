import {
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Image from "src/components/Image";
import Scrollbar from "src/components/Scrollbar";
import Trim from "src/components/Trim";
import EmptyTable from "src/components/emptyTable";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";

const useProductActive = () => {
  const [activeProduct, setActiveProduct] = useState([]);
  const fetchData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "api/admin/dashboard/product-active-subscription"
      );

      if (status === 200) {
        setActiveProduct(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return activeProduct;
};

export default function ProductActive() {
  const activeProducts = useProductActive();
  const isEmpty = !Boolean(activeProducts?.length);
  return (
    <Card>
      <Box sx={{ minHeight: 280 }}>
        <CardHeader
          title={
            <Typography variant="subtitle2">
              <Translate>{"business.productsActive"}</Translate>
            </Typography>
          }
        />
        {isEmpty ? (
          <Box>
            <EmptyTable title="No Data Available" />
          </Box>
        ) : (
          <Scrollbar>
            <Stack
              spacing={2}
              sx={{ p: 3, pr: 0, maxHeight: 300, overflowY: "scroll" }}
            >
              {activeProducts.map((product) => (
                <ProductItem {...product} />
              ))}
            </Stack>
          </Scrollbar>
        )}

        {/* <Box sx={{ p: 3, textAlign: "right" }}>
        <Button
          size="small"
          color="primary"
          endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
        >
       {("business.viewMore")}  
        </Button>
      </Box> */}
      </Box>
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    name: PropTypes.string,
  }),
};

function ProductItem(props) {
  const { count, product } = props;
  const { name, product_images: image } = product;
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Image
          alt={name}
          src={image[0]?.image_url}
          sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
        />

        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <Link
            component={RouterLink}
            to="#"
            sx={{ color: "text.primary", typography: "subtitle2" }}
          >
            <Trim value={name} />
          </Link>
          <Stack direction="row">
            <Typography variant="caption" color="text.secondary">
              <b>{count}</b>&nbsp;
              {"business.subscriptions"}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
