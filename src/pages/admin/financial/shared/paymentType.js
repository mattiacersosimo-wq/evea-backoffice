import { capitalCase } from "change-case";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const AmountType = ({ isWallet }) => {
  const options = [
    { value: "", label: "userFinancial.depositWallet.all" },
    {
      value: "fund_transfer",
      label: "userFinancial.depositWallet.fundTransfer",
    },
    isWallet === "ewallet"
      ? {
          value: "referral_bonus",
          label: "userFinancial.depositWallet.referralBonus",
        }
      : {
          value: "product_purchased",
          label: "userFinancial.depositWallet.productPurchased",
        },

    {
      value: "credited_by_admin",
      label: "userFinancial.depositWallet.creditedByAdmin",
    },
    {
      value: "deducted_by_admin",
      label: "userFinancial.depositWallet.deductedByAdmin",
    },
  ];

  return (
    <RHFSelect
      name="payment_type"
      label={"userFinancial.eWallet.amountType"}
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
    >
      <Map
        list={options}
        render={({ value, label }) => (
          <Option value={value} label={label} isWallet={isWallet} />
        )}
      />
    </RHFSelect>
  );
};

const Option = ({ value, label }) => {
  return <option value={value}>{capitalCase(translate(label))}</option>;
};

// const binary = [
//   { value: "binary_bonus", label: "userFinancial.depositWallet.binary_bonus" },
// ];

export default AmountType;
