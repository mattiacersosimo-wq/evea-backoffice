import EmptyContent from "src/components/EmptyContent";

import empty from "src/images/ic_cart.svg";

const EmptyCart = () => {
  return (
    <EmptyContent
      title={"userOnlineStore.cartIsEmpty"}
      description="Look like you have no items in your shopping cart."
      img={empty}
    />
  );
};
export default EmptyCart;
