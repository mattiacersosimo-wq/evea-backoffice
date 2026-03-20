import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import Map from "src/components/map";
import Translate from "src/components/translate";
import useAvailablePayout from "./hooks/use-available-payout";

const AvailablePayout = () => {
  const { field } = useController({
    name: "payment_type",
  });
  const { setValue } = useFormContext();

  const availablePayouts = useAvailablePayout();

  const onChange = (id) => () => {
    const currentPayouts = [...field.value];

    const itemIndex = currentPayouts.findIndex((v) => id === v);
    if (itemIndex > -1) {
      if (currentPayouts.length === 1) return;
      currentPayouts.splice(itemIndex, 1);
    } else {
      currentPayouts.push(id);
    }
    setValue("payment_type", currentPayouts);
  };

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <Translate>settings.withdrawal.available_payouts</Translate>
      </Typography>

      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          <Map
            list={availablePayouts}
            render={({ id, name }) => {
              const isActive = field.value.includes(id);
              return (
                <FormControlLabel
                  value={id}
                  control={
                    <Checkbox
                      value={id}
                      size="small"
                      checked={isActive}
                      onClick={onChange(id)}
                    />
                  }
                  label={capitalCase(name)}
                />
              );
            }}
          />
        </RadioGroup>
      </FormControl>
    </Card>
  );
};

export default AvailablePayout;
