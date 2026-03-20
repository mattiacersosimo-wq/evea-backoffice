import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ReturnNullOnCondition } from "src/components/helpers";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const DynamicSelect = ({ name, label, options }) => {
    const { setValue } = useFormContext();

    useEffect(() => {
        if (options?.length > 0) {
            setValue(name, options[0]);
        }
    }, [options]);

    return (
        <ReturnNullOnCondition condition={options?.length > 0}>
            <RHFSelect name={name} label={label}>
                <Map
                    list={options}
                    render={(option) => (
                        <option value={option}>{option}</option>
                    )}
                />
            </RHFSelect>
        </ReturnNullOnCondition>
    );
};

export default DynamicSelect;
