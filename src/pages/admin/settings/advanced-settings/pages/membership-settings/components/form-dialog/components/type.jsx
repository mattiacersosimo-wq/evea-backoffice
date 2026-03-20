import React from "react";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

const options = [
  { label: "Custom", value: "custom" },
  { label: "Optional", value: "optional" },
  { label: "Mandatory", value: "mandatory" },
];

const Type = () => {
  return (
    <RHFSelect label="Type" name="type">
      <Map
        list={options}
        render={({ label, value }) => <option value={value}>{label}</option>}
      />
    </RHFSelect>
  );
};

export default Type;
