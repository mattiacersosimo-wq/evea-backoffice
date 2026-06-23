import dayjs from "dayjs";
import moment from "moment";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BaseDatePicker from "src/components/base-date-picker";
import serializeDate from "src/utils/serialize-date";

const DatePicker = ({ name, label, size }) => {
    const { control, watch, setValue } = useFormContext();
    const v = watch(name);

    const onChange = (field) => (newValue) => {
        if (newValue) {
            const date = moment(dayjs(newValue).format("MM/DD/YYYY"));
            field.onChange(serializeDate(date));
        } else {
            field.onChange(null);
        }
    };

    useEffect(() => {
        if (!v) {
            setValue(name, serializeDate(moment()));
        }
    }, [v]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <BaseDatePicker
                        label={label}
                        size={size}
                        error={error}
                        value={field.value}
                        onChange={onChange(field)}
                    />
                );
            }}
        />
    );
};

export default DatePicker;
