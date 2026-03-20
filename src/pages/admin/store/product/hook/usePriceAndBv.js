import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const extractMonth = (v) => {
  const month = parseInt(v.split(" ")[0]);
  // return month === 1 ? null : month;
  return month;
};

const getMonths = (arg) => Object.keys(arg).map(extractMonth).filter(Number);

const usePriceAndBvs = () => {
  const { getValues, setValue, watch } = useFormContext();
  const [months, setMonths] = useState([1]);

  const bv = getValues("bv");
  const remove = (month) => () => {
    const removeIndex = months.findIndex((v) => v === month);
    setMonths((prev) => {
      const newState = [...prev];
      newState.splice(removeIndex, 1, null);
      return newState;
    });
    const [bv, price] = getValues(["bv", "price"]);
    const key = `${month} month`.trim();
    delete price[key];
    delete bv[key];

    setValue("price", price);
    setValue("bv", bv);
  };
  const clear = () => {
    setValue("price", { "1 month": "" });
    setValue("bv", { "1 month": "" });
    setMonths([1]);
  };

  const addMonth = () => {
    setMonths((prevState) =>
      prevState.length && prevState.every((v) => v === null)
        ? [3 * Math.pow(2, 0)]
        : [...months, 3 * Math.pow(2, months.length - 1)]
    );
  };
  useEffect(() => {
    if (bv) setMonths(getMonths(bv));
  }, []);

  return { months, remove, addMonth, clear };
};

export default usePriceAndBvs;
