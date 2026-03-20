import { Stack, Typography } from "@mui/material";
import orderBy from "lodash/orderBy";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import CartWidget from "src/components/cartWidget";
import { FormProvider } from "src/components/hook-form";
import { filterProducts, getProductsUser } from "src/redux/slices/product";
import { useDispatch, useSelector } from "src/redux/store";
import { PATH_USER } from "src/routes/paths";
import {
  ShopFilterSidebar,
  ShopProductList,
  ShopProductSearch,
  ShopTagFiltered,
} from "src/sections/@dashboard/e-commerce/shop";

export default function EcommerceShop() {
  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === "All";

  useEffect(() => {
    dispatch(getProductsUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveGender = (value) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue("gender", newValue);
  };

  const handleRemoveCategory = () => {
    setValue("category", "All");
  };

  const handleRemoveColor = (value) => {
    const newValue = filters.colors.filter((item) => item !== value);
    setValue("colors", newValue);
  };

  const handleRemovePrice = () => {
    setValue("priceRange", "");
  };

  const handleRemoveRating = () => {
    setValue("rating", "");
  };

  return (
    <Page title="Ecommerce: Shop" sx={{ p: 4 }}>
      <HeaderBreadcrumbs
        heading="Product Subscription"
        links={[
          { name: "Dashboard", href: PATH_USER.user_dashboard },
          { name: "Shop" },
        ]}
      />

      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <ShopProductSearch />

        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <FormProvider methods={methods}>
            <ShopFilterSidebar
              onResetAll={handleResetFilter}
              isOpen={openFilter}
              onOpen={handleOpenFilter}
              onClose={handleCloseFilter}
            />
          </FormProvider>
        </Stack>
      </Stack>

      <Stack sx={{ mb: 3 }}>
        {!isDefault && (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>{filteredProducts.length}</strong>
              &nbsp;Products found
            </Typography>

            <ShopTagFiltered
              filters={filters}
              isShowReset={!isDefault && !openFilter}
              onRemoveGender={handleRemoveGender}
              onRemoveCategory={handleRemoveCategory}
              onRemoveColor={handleRemoveColor}
              onRemovePrice={handleRemovePrice}
              onRemoveRating={handleRemoveRating}
              onResetAll={handleResetFilter}
            />
          </>
        )}
      </Stack>

      <ShopProductList
        products={filteredProducts}
        loading={!products.length && isDefault}
      />
      <CartWidget />
    </Page>
  );
}

function applyFilter(products, sortBy, filters) {
  if (sortBy === "featured") {
    products = orderBy(products, ["sold"], ["desc"]);
  }
  if (sortBy === "newest") {
    products = orderBy(products, ["createdAt"], ["desc"]);
  }
  if (sortBy === "priceDesc") {
    products = orderBy(products, ["price"], ["desc"]);
  }
  if (sortBy === "priceAsc") {
    products = orderBy(products, ["price"], ["asc"]);
  }
  if (filters.gender.length > 0) {
    products = products.filter((product) =>
      filters.gender.includes(product.gender)
    );
  }
  if (filters.category !== "All") {
    products = products.filter(
      (product) => product.category === filters.category
    );
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) =>
      product.colors.some((color) => filters.colors.includes(color))
    );
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === "below") {
        return product.price < 25;
      }
      if (filters.priceRange === "between") {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value) => {
        if (value === "up4Star") return 4;
        if (value === "up3Star") return 3;
        if (value === "up2Star") return 2;
        return 1;
      };
      return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
