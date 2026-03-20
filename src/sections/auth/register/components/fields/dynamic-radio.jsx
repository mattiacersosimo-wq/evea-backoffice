import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ReturnNullOnCondition } from "src/components/helpers";
import Map from "src/components/map";

const DynamicRadio = ({ name, label, options = [] }) => {
    const { watch, setValue } = useFormContext();
    const value = watch(name) || null;

    useEffect(() => {
        if (options?.length > 0) {
            setValue(name, options[0]);
        }
    }, [options]);

    return (
        <ReturnNullOnCondition condition={options?.length > 0}>
            <FormControl>
                <FormLabel id={name} sx={{ textAlign: "left" }}>
                    {label}
                </FormLabel>
                <RadioGroup
                    aria-labelledby={name}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        setValue(name, value);
                    }}
                >
                    <Map
                        list={options}
                        render={(option) => (
                            <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                            />
                        )}
                    />
                </RadioGroup>
            </FormControl>
        </ReturnNullOnCondition>
    );
};

export default DynamicRadio;
