import { useEffect } from "react";
import checkSuccess from "src/api/common/checkSuccess";
import useAuth from "src/hooks/useAuth";

const useCheckSuccess = (isOpen, payment_id, onSuccess = () => null) => {
  const {
    user: { id },
  } = useAuth();
  useEffect(() => {
    const check = async () => {
      const { status, invoiceId } = await checkSuccess(payment_id, id);
      const success = status === "finished";
      if (success) {
        onSuccess(invoiceId);
      }
    };
    if (payment_id && isOpen) {
      const interval = setInterval(check, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [payment_id, isOpen]);
};

export default useCheckSuccess;
