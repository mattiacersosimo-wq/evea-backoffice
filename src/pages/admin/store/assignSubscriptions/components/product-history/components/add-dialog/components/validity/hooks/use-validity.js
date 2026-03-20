import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const useValidity = () => {
  const { reset, getValues, setFocus } = useFormContext();
  const [isCustom, setIsCustom] = useState(false);
  const [selected, setSelected] = useState(null);

  const setMonth = (validity, id) => () => {
    setIsCustom(false);
    setSelected(id);
    reset({
      ...getValues(),
      period_month: validity,
      product_price_id: id,
    });
  };

  const setCustom = () => {
    setIsCustom(true);
    setSelected(null);
  };

  useEffect(() => {
    const { period_month, product_price_id, custom_days, ...rest } =
      getValues();
    if (isCustom) {
      setFocus("custom_days", { shouldSelect: true });
      reset({ ...rest, custom_days });
    } else {
      reset({ ...rest, period_month, product_price_id });
    }
  }, [isCustom]);

  return { isCustom, selected, setMonth, setCustom };
};

export default useValidity;
