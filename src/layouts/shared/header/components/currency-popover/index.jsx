import { Menu, MenuItem, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IconButtonAnimate } from "src/components/animate";
import { useCurrency } from "src/store/currency";

const CurrencyPopOver = () => {
  const { currency, setCurrency } = useCurrency();
  const { list: currencies, code } = currency;
  const [showCurrency, setShowCurrency] = useState(null);

  const selected = useMemo(() => {
    return currencies.find(({ code: c }) => c === code);
  }, [code, currencies]);
  const enabledCurrencies = currencies.filter(
    (currency) => currency.is_enable === 1
  );

  const handleClose = () => setShowCurrency(false);

  return (
    <>
      <IconButtonAnimate
        onClick={(e) => {
          setShowCurrency(e.currentTarget);
        }}
      >
        <Typography variant="button">
          {selected?.code} {selected?.symbol}
        </Typography>
      </IconButtonAnimate>

      <Menu
        onClose={handleClose}
        open={Boolean(showCurrency)}
        anchorEl={showCurrency}
      >
        {enabledCurrencies?.map(({ code, symbol }) => {
          return (
            <MenuItem
              onClick={() => {
                localStorage.setItem("currency", code);
                setCurrency((state) => {
                  return { ...state, code };
                });
                handleClose();
              }}
            >
              {code} - {symbol}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default CurrencyPopOver;
