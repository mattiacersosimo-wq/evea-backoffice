import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import { useGetCurrencySymbol } from "src/components/with-prefix";
import useLocales from "src/hooks/useLocales";
import useAvailableCoins from "../hooks/useAvailableCoins";

const Available = ({ min, available = "[]", handleChange }) => {
  const { translate } = useLocales();
  const coins = useAvailableCoins();
  const [activeCoins, setActiveCoins] = useState([]);
  useEffect(() => {
    if (available) {
      setActiveCoins(available);
    }
  }, [available]);

  const symbol = useGetCurrencySymbol();
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {translate("adminSettings.network.minAmount")} {symbol}
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={min}
        name="min_amount"
        onChange={handleChange()}
      />

      <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontSize: "0.8rem" }}>
        {translate("adminSettings.network.availableCoins")}
      </Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {coins.map(({ id, name }) => {
            const isActive = activeCoins.includes(id);
            return (
              <FormControlLabel
                value={id}
                control={
                  <Radio
                    size="small"
                    checked={isActive}
                    onClick={handleChange("coin")}
                  />
                }
                label={capitalCase(name)}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Available;
