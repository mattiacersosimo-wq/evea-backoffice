import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "src/hooks/useAuth";
import { object, string } from "yup";

const defaultValues = { swift: "", iban: "" };

const schema = object().shape({
    iban: string().required("IBAN obbligatorio").min(15, "IBAN non valido"),
    swift: string().when("iban", {
        is: (val) => val && !val.toUpperCase().startsWith("IT"),
        then: (s) => s.required("BIC/SWIFT obbligatorio per IBAN non italiano"),
        otherwise: (s) => s.notRequired(),
    }),
});

const useUpdateForm = () => {
    const { user } = useAuth();
    const { swift, iban } = user?.user_profile || {};
    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset } = methods;

    useEffect(() => {
        reset({
            swift: swift || "",
            iban: iban || "",
        });
    }, [swift, iban]);

    return methods;
};

export default useUpdateForm;
