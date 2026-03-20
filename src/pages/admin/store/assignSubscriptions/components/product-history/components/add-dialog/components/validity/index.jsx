import { Box, Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import useGetProductPriceList from "./hooks/use-get-product-price-list";
import useValidity from "./hooks/use-validity";

const Validity = () => {
  const prices = useGetProductPriceList();
  const { isCustom, selected, setCustom, setMonth } = useValidity();
  const { register } = useFormContext();

  useEffect(() => {
    if (prices.length) {
      const [defaultValue] = prices;
      if (defaultValue) {
        const { validity, id } = defaultValue;
        setMonth(validity, id)();
      }
    }
  }, [prices]);

  if (!prices.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        gap: 1,
      }}
    >
      {prices.map(({ id, validity }) => (
        <Button
          color={selected === id ? "error" : "primary"}
          variant="contained"
          key={id}
          onClick={setMonth(validity, id)}
        >
          {validity} month
        </Button>
      ))}
      <Button
        onClick={setCustom}
        variant="outlined"
        color={selected ? "secondary" : "primary"}
      >
        Custom
      </Button>
      <TextField
        {...register("custom_days")}
        type="number"
        margin="none"
        sx={{
          display: isCustom ? "block" : "none",
        }}
      />
    </Box>
  );
};

export default Validity;
