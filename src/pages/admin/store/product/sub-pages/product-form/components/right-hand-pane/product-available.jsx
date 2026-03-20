import { Box, Card, FormControlLabel, Stack, Switch } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import LabelStyle from "src/components/label-style";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import Ternary from "src/components/ternary";

const ProductAvailable = () => {
  const { watch, setValue } = useFormContext();

  const isPackage = useIsPackage();
  const { t } = useTranslation();
  return (
    <Card sx={{ p: 3 }}>
      <FormControlLabel
        onChange={(e) => setValue("active", Number(e.target.checked))}
        control={<Switch checked={watch("active") === 1} />}
        label={t("products.add.status")}
      />
      <Stack spacing={3} mt={2}>
        <LabelStyle>
          <Ternary
            when={isPackage}
            then={t("products.add.package_available")}
            otherwise={t("products.add.product_available")}
          />
        </LabelStyle>
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
          <RHFDatePicker
            name="available_from"
            label={"products.add.accessFrom"}
          />

          <RHFDatePicker name="available_to" label={"products.add.accessTo"} />
        </Box>
      </Stack>
    </Card>
  );
};

export default ProductAvailable;
