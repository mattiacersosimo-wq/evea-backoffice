import { useTranslation } from "react-i18next";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";
import options from "./_options";
import Option from "./components/option";

const DepositWalletAmountType = () => {
  const { t } = useTranslation();
  return (
    <RHFSelect name="payment_type" label="search.amount_type" size="small">
      <Map
        list={options}
        render={({ value, label }) => <Option value={value} label={t(label)} />}
      />
    </RHFSelect>
  );
};

export default DepositWalletAmountType;
