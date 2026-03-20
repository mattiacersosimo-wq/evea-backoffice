import { Box } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";

import ChooseProducts from "./choose-products";
import MaterialCategories from "./material-categories";

const Main = () => {
  return (
    <Box
      sx={{
        display: "grid",
        columnGap: 2,
        rowGap: 3,
        mt: 2,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        },
      }}
    >
      <ChooseProducts />
      <MaterialCategories />

      <RHFTextField
        name="description"
        type="text"
        label={"material.add_material.description"}
        multiline
        fullWidth
        rows={2}
      />
    </Box>
  );
};

export default Main;
