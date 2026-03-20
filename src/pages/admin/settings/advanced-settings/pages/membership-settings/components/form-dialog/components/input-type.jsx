import React from "react";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const options = [
    {
        label: "Text",
        value: "text",
    },
    {
        label: "TextArea",
        value: "textarea",
    },
    {
        label: "Select",
        value: "select",
    },
    {
        label: "Checkbox",
        value: "checkbox",
    },
    {
        label: "Radio",
        value: "radio",
    },
    {
        label: "Date",
        value: "date",
    },
    {
        label: "Password",
        value: "password",
    },
    {
        label: "Gender",
        value: "gender",
    },
];

const InputType = () => {
    return (
        <RHFSelect label="Input Type" name="input_type">
            <Map
                list={options}
                render={({ label, value }) => (
                    <option value={value}>{label}</option>
                )}
            />
        </RHFSelect>
    );
};

export default InputType;
