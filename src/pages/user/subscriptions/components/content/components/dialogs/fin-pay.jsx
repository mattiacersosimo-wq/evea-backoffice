import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Translate from "src/components/translate";
import { useSubscriptionContext } from "src/pages/user/subscriptions/store/subscription";
import AddCard from "../../addCard";
import Transition from "src/utils/dialog-animation";

const FinPay = ({ open, onClose, reload }) => {
  const data = useSubscriptionContext();
  const { purchase_id, product_id } = data;
  const theme = useTheme();
  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      aria-labelledby="recurring-payment"
      TransitionComponent={Transition}
    >
      <DialogTitle id="add-article-category">
        <Translate>user.subscriptions.enable_recurring</Translate>
      </DialogTitle>
      <AddCard
        reload={reload}
        onClose={onClose}
        productId={product_id}
        purchaseId={purchase_id}
      />
    </Dialog>
  );
};

export default FinPay;
