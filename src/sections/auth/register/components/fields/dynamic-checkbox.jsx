import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ReturnNullOnCondition } from "src/components/helpers";
import Map from "src/components/map";

const DynamicCheckbox = ({ name, label, options }) => {
    const { watch, setValue } = useFormContext();
    const value = watch(name) || [];

    const handleChange = (option) => (_, v) => {
        if (v) {
            setValue(name, [...value, option]);
            return;
        }

        const itemIndex = value.indexOf(option);
        if (itemIndex > -1) {
            const temp = [...value];
            temp.splice(itemIndex, 1);
            setValue(name, temp);
        }
    };

    return (
        <ReturnNullOnCondition condition={options?.length > 0}>
            <FormControl>
                <FormLabel id={name} sx={{ textAlign: "left" }}>
                    {label}
                </FormLabel>
                <Map
                    list={options}
                    render={(option) => (
                        <FormControlLabel
                            value={option}
                            control={
                                <Checkbox
                                    checked={value.indexOf(option) > -1}
                                    onChange={handleChange(option)}
                                />
                            }
                            label={option}
                        />
                    )}
                />
            </FormControl>
        </ReturnNullOnCondition>
    );
};

export default DynamicCheckbox;
