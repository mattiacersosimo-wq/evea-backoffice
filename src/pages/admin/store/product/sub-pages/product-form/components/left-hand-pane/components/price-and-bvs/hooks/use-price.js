import { useRef } from "react";
import { useFormContext } from "react-hook-form";

export const MONTH_LIMIT = 4;

const usePrice = () => {
  const { setValue, getValues } = useFormContext();
  const power = useRef(0);

  const handleChangePrice = (month) => (e) => {
    const temp = { ...getValues("price") };
    const { value } = e.target;

    const parsedValue = parseFloat(value);

    setValue("price", {
      ...temp,
      [month]: Boolean(parsedValue) ? Math.abs(parsedValue) : "",
    });
  };

  const handleMonthChange = (prevMonth) => (e) => {
    const { value: month } = e.target;
    const temp = { ...getValues("price") };
    const targetValue = temp[month];
    const currentValue = temp[prevMonth];

    if (temp.hasOwnProperty(month)) {
      setValue("price", {
        ...temp,
        [prevMonth]: targetValue,
        [month]: currentValue,
      });
    } else {
      delete temp[prevMonth];
      setValue("price", {
        ...temp,
        [month]: currentValue,
      });
    }
  };

  const removeEntry = (month) => () => {
    const temp = { ...getValues("price") };

    delete temp[month];
    power.current -= 1;

    setValue("price", temp);
  };

  const addMonth = () => {
    const temp = { ...getValues("price") };

    if (power.current === 5 && Object.keys(getValues("price")).length !== 6) {
      if (temp[1] === undefined) {
        temp[1] = "";
        setValue("price", temp);
        return;
      }

      for (let i = 0; i < power.current; i++) {
        const month = 3 * 2 ** i;
        if (temp[month]) {
          continue;
        }
        temp[month] = "";
        setValue("price", temp);
      }
      return;
    }
    if (Object.keys(getValues("price")).length === 6) return;

    const newMonth = 3 * 2 ** power.current;
    power.current += 1;

    if (temp.hasOwnProperty(newMonth)) {
      addMonth();
      return;
    }
    temp[newMonth] = "";
    setValue("price", temp);
  };

  const clear = async () => {
    setValue("price", { 1: "" });
    power.current = 0;
  };

  return { handleChangePrice, handleMonthChange, removeEntry, addMonth, clear };
};

export default usePrice;
