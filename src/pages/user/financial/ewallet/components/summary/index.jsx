import { Grid } from "@mui/material";

import Cards from "./cards";

const Summary = ({ summary }) => {
  const summaryCard = [
    {
      title: "financial.e_wallet.cards.balance",
      icon: "arcticons:priceconverter",
      color: "#d279a6",
      key: "balance",
    },
    {
      title: "financial.e_wallet.cards.transfer",
      icon: "mdi:logout",
      color: "#6699ff",
      key: "transfer_out",
    },
    {
      title: "financial.e_wallet.cards.transfer_in",
      icon: "mdi:login",
      color: "#c7ff66",
      key: "transfer_in",
    },
    {
      title: "financial.e_wallet.cards.payout",
      icon: "fluent:wallet-48-regular",
      color: "#993366",
      key: "total_payout",
    },
    {
      title: "financial.e_wallet.cards.bonus",
      icon: "carbon:ibm-cloud-pak-network-automation",
      color: "#999966",
      key: "total_earned_bonus",
    },
  ];
  return (
    <>
      {summaryCard.map((props) => (
        <Grid item xs={12} md={2.4}>
          <Cards {...props} total={summary[props.key]} />
        </Grid>
      ))}
    </>
  );
};

export default Summary;
