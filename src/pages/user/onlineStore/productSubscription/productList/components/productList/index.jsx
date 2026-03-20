import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Map from "src/components/map";
import { SkeletonProductItem } from "src/components/skeleton";
import Ternary from "src/components/ternary";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const ProductList = ({ products }) => {
  const list = !products?.length ? [...Array(12)] : products;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(3, 1fr)",
        },
      }}
    >
      <Map
        list={list}
        render={(product, index) => (
          <Ternary
            when={product}
            then={<ProductCard key={product?.id} product={product} />}
            otherwise={<SkeletonProductItem key={index} />}
          />
        )}
      />
    </Box>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductList;
