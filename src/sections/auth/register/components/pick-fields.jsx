import Password from "src/components/Password";
import Countries from "src/components/countries";
import { RHFTextField } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import ChooseGender from "./fields/choose-gender";
import DatePicker from "./fields/date";
import DynamicCheckbox from "./fields/dynamic-checkbox";
import DynamicRadio from "./fields/dynamic-radio";
import DynamicSelect from "./fields/dynamic-select";

const PickField = ({ type, label, name, inputOptions }) => {
    switch (type) {
        case "password": {
            return <Password label={label} name={name} />;
        }

        case "date": {
            return <DatePicker label={label} name={name} />;
        }

        case "gender": {
            return <ChooseGender label={label} name={name} />;
        }

        case "country": {
            return <Countries label={label} name={name} />;
        }

        case "radio": {
            return (
                <DynamicRadio
                    label={label}
                    name={name}
                    options={inputOptions}
                />
            );
        }

        case "select": {
            return (
                <DynamicSelect
                    label={label}
                    name={name}
                    options={inputOptions}
                />
            );
        }
        case "checkbox": {
            return (
                <DynamicCheckbox
                    label={label}
                    name={name}
                    options={inputOptions}
                />
            );
        }

        case "textarea": {
            return (
                <RHFTextField
                    type={type}
                    label={label}
                    name={name}
                    multiline
                    maxRows={6}
                    rows={3}
                />
            );
        }

        default: {
            return <RHFTextField type={type} label={label} name={name} />;
        }
    }
};

export default PickField;
