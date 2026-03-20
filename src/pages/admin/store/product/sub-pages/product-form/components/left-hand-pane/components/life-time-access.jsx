import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { RHFCheckbox, RHFTextField } from "src/components/hook-form";

import { isBinary } from "src/utils/isBinary";

const LifeTimeAccess = () => {
  const isChecked = useFormContext().watch("life_time_access");

  return (
    <div>
      <RHFCheckbox
        name="life_time_access"
        label={"adminStore.products.lifeTimeAccess"}
      />
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
        {isChecked && (
          <>
            <RHFTextField
              name="no_of_days"
              label={"adminStore.products.noOfDays"}
            />
            <RHFTextField
              name="life_time_price"
              label={"adminStore.products.priceOfLifeTime"}
            />
            {isBinary() && (
              <RHFTextField
                name="life_time_business_volume"
                label={"adminStore.products.BVOfLifeTime"}
              />
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default LifeTimeAccess;
