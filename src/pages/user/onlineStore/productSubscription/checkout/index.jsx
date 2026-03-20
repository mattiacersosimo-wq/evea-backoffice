import { useState } from "react";
import Ternary from "src/components/ternary";
import Cart from "./components/cart";
import CartStepper, { STEPS } from "./components/cartStepper";
import OrderComplete from "./components/orderComplete";
import Payment from "./components/payment";
import Wrapper from "./components/wrapper";
import CartProvider from "./store/cartStore";
import PurchaseProvider from "./store/purchaseStore";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isComplete = activeStep === STEPS.length;

  return (
    <Wrapper>
      <PurchaseProvider>
        <CartProvider>
          <CartStepper activeStep={activeStep} />

          <Ternary
            when={isComplete}
            then={<OrderComplete open={isComplete} />}
            otherwise={
              <Ternary
                when={Boolean(activeStep)}
                then={<Payment goBack={() => setActiveStep(0)} />}
                otherwise={<Cart nextStep={() => setActiveStep(1)} />}
              />
            }
          />
        </CartProvider>
      </PurchaseProvider>
    </Wrapper>
  );
};

export default Checkout;
