import { useTranslation } from "react-i18next";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";
import options from "./_options";
import Option from "./components/option";

const EWalletAmountTypes = () => {
  const { t } = useTranslation();
  return (
    <RHFSelect name="payment_type" label="search.amount_type" size="small">
      <Map
        list={options}
        render={({ value, label, plans }) => (
          <Option value={value} label={t(label)} plans={plans} />
        )}
      />
    </RHFSelect>
  );
};

export default EWalletAmountTypes;
