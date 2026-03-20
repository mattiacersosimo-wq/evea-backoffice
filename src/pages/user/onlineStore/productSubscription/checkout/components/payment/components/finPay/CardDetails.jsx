import { Box, Typography } from "@mui/material";
import Countries from "src/components/countries";
import { RHFTextField } from "src/components/hook-form";

const PersonalInfo = () => {
  return (
    <Box>
      <Typography sx={{ marginBottom: "1rem" }} variant="h5">
        Enter Personal Details
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          gridTemplateRows: "auto",
          gridTemplateAreas: `"city state" "zip country" "address address"
    `,
        }}
      >
        <Box sx={{ gridArea: "city" }}>
          <RHFTextField label={"userOnlineStore.city"} name="city" />
        </Box>
        <Box sx={{ gridArea: "state" }}>
          <RHFTextField label={"userOnlineStore.state"} name="state" />
        </Box>
        <Box sx={{ gridArea: "zip" }}>
          <RHFTextField label={"userOnlineStore.zipCode"} name="zip" />
        </Box>
        <Box sx={{ gridArea: "country" }}>
          <Countries />
        </Box>

        <Box sx={{ gridArea: "address" }}>
          <RHFTextField
            label={"userOnlineStore.address"}
            name="address1"
            rows={3}
            multiline
          />
        </Box>
      </Box>
    </Box>
  );
};
export default PersonalInfo;
