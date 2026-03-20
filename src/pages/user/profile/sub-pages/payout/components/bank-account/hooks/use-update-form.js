import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "src/hooks/useAuth";
import { object, string } from "yup";

const defaultValues = { bank_name: "", bank_country: "", swift: "", iban: "" };

const schema = object().shape({
    bank_name: string().required("Bank Name is required"),
    bank_country: string().required("Country Name is required"),
    swift: string().required("Swift Code is required"),
    iban: string().required("IBAN is required"),
});

const useUpdateForm = () => {
    const { user } = useAuth();
    const { bank_name, bank_country, swift, iban } = user?.user_profile || {};
    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset } = methods;

    useEffect(() => {
        reset({
            bank_name: bank_name || "",
            bank_country: bank_country || "",
            swift: swift || "",
            iban: iban || "",
        });
    }, [bank_name, bank_country, swift, iban]);

    return methods;
};

export default useUpdateForm;
