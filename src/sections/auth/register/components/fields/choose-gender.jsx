import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const options = [
    {
        label: "Male",
        value: "male",
    },
    {
        label: "Female",
        value: "female",
    },
    {
        label: "Other",
        value: "other",
    },
];

const ChooseGender = ({ name, label }) => {
    return (
        <RHFSelect label={label} name={name}>
            <option value="" />
            <Map
                list={options}
                render={({ label, value }) => (
                    <option value={value}>{label}</option>
                )}
            />
        </RHFSelect>
    );
};
export default ChooseGender;
