import { Button, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

export const MONTHS = [1, 3, 6, 12, 24, 48];

const PriceList = ({ handleChangePrice, handleMonthChange, removeEntry }) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const hasError = Boolean(errors?.price);
  const tPrice = t("business.price");
  const tMonth = t("global.month");
  const price = watch("price");

  const showRemove = Object.keys(price).length > 1;
  return (
    <Map
      list={Object.entries(price)}
      render={([month, v], i) => {
        return (
          <Ternary
            when={month}
            then={
              <>
                <TextField
                  size="small"
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                  label={t("global.month")}
                  value={month}
                  onChange={handleMonthChange(month)}
                >
                  <Map
                    list={MONTHS}
                    render={(month) => {
                      return (
                        <option value={month}>
                          {month} {tMonth}
                        </option>
                      );
                    }}
                  />
                </TextField>

                <TextField
                  onChange={handleChangePrice(month)}
                  value={v}
                  InputLabelProps={{ shrink: true }}
                  label={`${tPrice} ${month} ${tMonth} `}
                  placeholder={`${tPrice} ${month} ${tMonth} `}
                  size="small"
                  helperText={hasError ? t(errors?.price?.message) : null}
                  error={hasError}
                />
                <Ternary
                  when={showRemove}
                  then={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Button
                        onClick={removeEntry(month)}
                        color="error"
                        size="small"
                        startIcon={<Iconify icon={"gala:remove"} />}
                        name="remove"
                      >
                        <Translate>{"global.remove"}</Translate>
                      </Button>
                    </span>
                  }
                  otherwise={<span />}
                />
              </>
            }
          />
        );
      }}
    />
  );
};

export default PriceList;
