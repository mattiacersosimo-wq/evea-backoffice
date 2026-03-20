import { Box, Button, Grid } from "@mui/material";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Iconify from "src/components/Iconify";

import PriceList, { MONTHS } from "./components/price-list";
import usePrice from "./hooks/use-price";
import Translate from "src/components/translate";

const PriceAndBvs = () => {
  const { watch } = useFormContext();
  const { addMonth, clear, ...rest } = usePrice();

  const price = watch("price");

  const disableAdd = useMemo(
    () => Object.keys(price).length === MONTHS.length,
    [price]
  );

  return (
    <>
      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <PriceList {...rest} />
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{ mb: 5 }}
      >
        <Button
          onClick={clear}
          color="info"
          size="small"
          startIcon={<Iconify icon={"carbon:reset"} />}
        >
          <Translate>products.add.reset</Translate>
        </Button>
        <Button
          disabled={disableAdd}
          onClick={addMonth}
          size="small"
          startIcon={<Iconify icon={"eva:plus-fill"} />}
          sx={{ marginLeft: 3 }}
        >
          <Translate>products.add.add_price</Translate>
        </Button>
      </Grid>
    </>
  );
};

export default PriceAndBvs;
