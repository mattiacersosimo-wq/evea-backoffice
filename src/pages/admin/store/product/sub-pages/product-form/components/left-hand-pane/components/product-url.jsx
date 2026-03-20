import { IconButton, InputAdornment, TextField } from "@mui/material";
import { paramCase } from "change-case";
import { useSnackbar } from "notistack";
import { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import Iconify from "src/components/Iconify";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

import { PATH_USER } from "src/routes/paths";
import buildPath from "src/utils/build-path";
import icons from "src/utils/icons";

const ProductUrl = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [productName, productUrl, is_package] = watch([
    "name",
    "product_url",
    "is_package",
  ]);
  const { pid } = useParams();
  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();

  const edited = useRef(false);

  useMemo(() => {
    if (!edited.current) {
      if (productUrl && pid) return;
      setValue("product_url", paramCase(productName));
    }
  }, [productName]);

  const onChange = (e) => {
    setValue("product_url", e.target.value);
    edited.current = true;
  };

  const copy = () => {
    try {
      const URI = buildPath(
        window.location.origin,
        isPackage
          ? PATH_USER.onlineStore.productSubscription.packages
              .view(productUrl)
              .slice(1)
          : isSubscription
          ? PATH_USER.onlineStore.productSubscription.subscriptions
              .view(productUrl)
              .slice(1)
          : PATH_USER.onlineStore.productSubscription.products
              .view(productUrl)
              .slice(1)
      );
      navigator.clipboard.writeText(URI);
      enqueueSnackbar("Successfully copied");
    } catch (err) {
      enqueueSnackbar("Something went wrong!Try again", { variant: "error" });
    }
  };
  return (
    <TextField
      name="product_url"
      value={productUrl}
      onChange={onChange}
      label={`${t("products.add.product_page_url")}(${
        window.location.origin
      }/)`}
      error={Boolean(errors?.product_url)}
      helperText={t(errors?.product_url?.message)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={copy}>
              <Iconify icon={icons.copy} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ProductUrl;
