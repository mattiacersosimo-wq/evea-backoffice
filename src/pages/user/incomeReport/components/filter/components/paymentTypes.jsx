import { useTranslation } from "react-i18next";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const paymentTypes = [
  { label: "amount_types.all", value: "all" },
  { label: "amount_types.r_bonus", value: "referral_bonus" },
  { label: "amount_types.b_bonus", value: "binary_bonus" },
  { label: "amount_types.first_order_bonus", value: "first_order_bonus" },
  { label: "amount_types.a_bonus", value: "achievement_bonus" },
  { label: "amount_types.credited_by_admin", value: "credited_by_admin" },
];

const Option = ({ type }) => {
  const { t } = useTranslation();
  return <option value={type.value}>{t(type.label)}</option>;
};

const PaymentTypes = () => {
  return (
    <RHFSelect name="payment_type" size="small">
      <Map list={paymentTypes} render={(type) => <Option type={type} />} />
    </RHFSelect>
  );
};

export default PaymentTypes;
