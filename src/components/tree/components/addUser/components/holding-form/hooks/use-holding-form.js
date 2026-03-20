import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { number, object } from "yup";

const defaultValues = {
    leg: null,
    placement_id: null,
    user_id: null,
};

const schema = object().shape({
    user_id: number()
        .required("User is required")
        .typeError("User is required"),
});

const useHoldingForm = (userInfo = {}) => {
    const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

    const { setValue } = methods;
    const { placement_id, leg } = userInfo;

    useEffect(() => {
        if (placement_id) {
            setValue("placement_id", placement_id);
        }
    }, [placement_id]);

    useEffect(() => {
        if (leg) {
            setValue("leg", leg);
        }
    }, [leg]);

    return methods;
};

export default useHoldingForm;
