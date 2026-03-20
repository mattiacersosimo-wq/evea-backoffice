import fetchUser from "src/utils/fetchUser";

export default async (productIds, packageId) => {
    const reqData = new FormData();
    if (packageId) {
        reqData.append("product_id[]", packageId);
    } else {
        productIds?.forEach((id) => reqData.append("product_id[]", id));
    }
    try {
        const { status, data } = await fetchUser.post(
            "product-payment-types",
            reqData
        );
        if (status === 200) {
            return data;
        }
    } catch (err) {
        return { status: false, error: err.errors };
    }
};
