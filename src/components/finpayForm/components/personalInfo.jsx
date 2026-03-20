import { Box, Typography } from "@mui/material";
import { getCountries, getStatesByShort } from "countrycitystatejson";
import { useFormContext } from "react-hook-form";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";

const PersonalInfo = () => {
  return (
    <Box>
      <Typography gutterBottom variant="subtitle2">
        <Translate>fin_pay.address</Translate>
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          gridTemplateRows: "auto",
          gridTemplateAreas: `"country state" "zip city" "address address"`,
        }}
      >
        <Box sx={{ gridArea: "country" }}>
          <Countries />
        </Box>
        <Box sx={{ gridArea: "state" }}>
          <States />
        </Box>
        <Box sx={{ gridArea: "zip" }}>
          <RHFTextField size="small" label="fin_pay.zip_code" name="zip" />
        </Box>
        <Box sx={{ gridArea: "city" }}>
          <RHFTextField label="fin_pay.city" name="city" size="small" />
        </Box>

        <Box sx={{ gridArea: "address" }}>
          <RHFTextField
            label="fin_pay.address"
            name="address1"
            rows={3}
            multiline
          />
        </Box>
      </Box>
    </Box>
  );
};

const States = () => {
  const { watch } = useFormContext();
  const states = getStatesByShort(watch("country")) || [];
  return (
    <RHFSelect name="state" label="fin_pay.state" size="small">
      <option />
      {states?.map((state) => (
        <option value={state}>{state}</option>
      ))}
    </RHFSelect>
  );
};

const Countries = () => {
  const countries = getCountries();
  return (
    <RHFSelect name="country" label="fin_pay.country" size="small">
      <option />
      {countries?.map(({ shortName, name }) => (
        <option value={shortName}>{name}</option>
      ))}
    </RHFSelect>
  );
};

export default PersonalInfo;
