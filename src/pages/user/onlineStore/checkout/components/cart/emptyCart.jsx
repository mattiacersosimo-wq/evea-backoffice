import { useTranslation } from "react-i18next";
import EmptyContent from "src/components/EmptyContent";

const EmptyCart = () => {
  const { t } = useTranslation();
  return (
    <EmptyContent
      title={t("user.online_store.product.cart_is_empty")}
      description={t("user.online_store.product.look_like")}
      img="/icons/empty_cart.svg"
    />
  );
};
export default EmptyCart;
