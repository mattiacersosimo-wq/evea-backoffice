import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getPaymentTypes } from "src/api/user/purchase";
import { fetchCart } from "../../../../cart/hooks/useCartList";
import {
    load as loadPurchase,
    usePurchaseData,
    usePurchaseDispatch,
} from "../../../../../store/purchaseStore";

const useFetchPurchaseMethods = () => {
    const { product_id: productIds } = usePurchaseData() || {};
    const purchaseDispatch = usePurchaseDispatch();
    const navigate = useNavigate();
    const { id: packageId } = useParams();

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [depositWalletBalance, setDepositWalletBalance] = useState(0);
    const [bankDetails, setBankDetails] = useState("");
    const fetchData = useCallback(async (ids = productIds) => {
        const { status, data } = await getPaymentTypes(ids, packageId);

        if (status) {
            setPaymentMethods(data.data);
            setDepositWalletBalance(data.depositwallet);
            setBankDetails(data.bank_details);
        }
    }, [packageId, productIds]);

    useEffect(() => {
        const hydrateAndFetch = async () => {
            const hasProductIds = Array.isArray(productIds) && productIds.length > 0;

            if (packageId || hasProductIds) {
                await fetchData(productIds);
                return;
            }

            const cartItems = await fetchCart();
            if (!cartItems.length) {
                navigate("/user/checkout");
                return;
            }

            // Restore purchase state after hard refresh; next render will fetch methods.
            purchaseDispatch(loadPurchase(cartItems));
        };

        hydrateAndFetch();
    }, [fetchData, navigate, packageId, productIds, purchaseDispatch]);

    return {
        bankDetails,
        paymentMethods,
        depositWalletBalance,
        fetchPaymentMethods: fetchData,
    };
};

export default useFetchPurchaseMethods;
