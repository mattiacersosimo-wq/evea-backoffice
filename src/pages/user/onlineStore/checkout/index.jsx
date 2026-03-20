import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import CartStepper from "./components/cartStepper";
import Wrapper from "./components/wrapper";
import CartProvider from "./store/cartStore";
import PurchaseProvider from "./store/purchaseStore";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("payment")) {
      setActiveStep(2);
    } else if (pathname.includes("shipping")) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [pathname]);

  return (
    <PurchaseProvider>
      <CartProvider>
        <Wrapper>
          <CartStepper activeStep={activeStep} />
          <Outlet />
        </Wrapper>
      </CartProvider>
    </PurchaseProvider>
  );
};

export default Checkout;
