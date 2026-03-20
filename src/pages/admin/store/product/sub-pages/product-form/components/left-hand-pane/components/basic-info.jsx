import { Box } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";

import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import ProductCategory from "../../product-category";
import Category from "./category";
import MetaInformation from "./meta-information";

const BasicInfo = () => {
  const isPackage = useIsPackage();

  return (
    <>
      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: !isPackage ? "1fr" : "1fr 1fr",
        }}
      >
        <RHFTextField
          name="name"
          label={
            isPackage
              ? "products.add.package_name"
              : "products.add.product_name"
          }
          sx={{
            gridColumn: !isPackage ? "1 / -1" : "auto",
            width: "100%",
          }}
        />
        {/* <Category />
         */}

        {isPackage && <ProductCategory />}
      </Box>
      <Box
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
        <MetaInformation />
      </Box>
    </>
  );
};
export default BasicInfo;
