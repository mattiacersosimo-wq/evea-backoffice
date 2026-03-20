import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { array, object, string } from "yup";

const defaultValues = {
    input_label: "",
    input_type: "text",
    input_name: "",
    required: 0,
    status: 1,
    unique: 0,
    type: "custom",
    input_options: [],
    sort_order: 13,
};

const schema = object().shape({
    input_label: string()
        .typeError("Input Label is required")
        .required("Input Label is required"),
    input_type: string()
        .typeError("Input Type is required")
        .required("Input Type is required"),

    input_options: array().when("input_type", {
        is: (v) => ["select", "checkbox", "radio"].indexOf(v) > -1,
        then: array()
            .required("At least one item is required")
            .min(1, "At least one item is required"),
    }),
});
const useMethods = () => {
    const methods = useForm({ defaultValues, resolver: yupResolver(schema) });

    return methods;
};
export default useMethods;
