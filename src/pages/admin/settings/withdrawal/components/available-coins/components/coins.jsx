import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useController, useFormContext } from "react-hook-form";
import Map from "src/components/map";
import useAvailableCoins from "../hooks/use-available-coins";

const Coins = () => {
  const coins = useAvailableCoins();
  const { field } = useController({
    name: "available_coins",
  });
  const { setValue } = useFormContext();

  const onChange = (id) => () => {
    const currentCoins = [...field.value];

    const itemIndex = currentCoins.findIndex((v) => id === v);
    if (itemIndex > -1) {
      if (currentCoins.length === 1) return;
      currentCoins.splice(itemIndex, 1);
    } else {
      currentCoins.push(id);
    }
    setValue("available_coins", currentCoins);
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        <Map
          list={coins}
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
  );
};

export default Coins;
