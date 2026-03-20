import { Checkbox, FormControlLabel, TableCell, TableRow } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import LabelStyle from "src/components/label-style";

const Row = ({
  handleUpdate,
  id,
  referral_count,
  team_volume,
  package_id,
  rank_criteria,
  referral_package_count,
  referral_package,
  personal_volume,
  bonus_amount,
  handleCheckboxChange,
  checkboxValues,
  setCheckboxValues,
  checkedData
}) => {
  const handleChange = (name) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: prevValues[name] ? 0 : 1,
    }));
    handleCheckboxChange(name);
  
  };
  const packageId = checkboxValues.package_id;


  return (
    <>
      <FormControlLabel
        label="Package"
        control={
          <Checkbox
            name="package_id"
            checked={checkboxValues.package_id}
            onChange={() => handleChange("package_id")}
          />
        }
      />
      <FormControlLabel
        label="Personal Volume"
        control={
          <Checkbox
          disabled={packageId === 1}
            name="personal_volume"
            checked={checkboxValues.personal_volume}
            onChange={() => handleChange("personal_volume")}
          />
        }
      />
      <FormControlLabel
        label="Referral Count"
        control={
          <Checkbox
          disabled={packageId === 1}
            name="referral_count"
            checked={checkboxValues.referral_count}
            onChange={() => handleChange("referral_count")}
          />
        }
      ></FormControlLabel>

      <FormControlLabel
        label="Referral Package"
        control={
          <Checkbox
          disabled={packageId === 1}
            name="referral_package"
            checked={checkboxValues.referral_package}
            onChange={() => handleChange("referral_package")}
          />
        }
      />

      <FormControlLabel
        label="Team Volume"
        control={
          <Checkbox
          disabled={packageId === 1}
            name="team_volume"
            checked={checkboxValues.team_volume}
            onChange={() => handleChange("team_volume")}
          />
        }
      />
    </>
  );
};

export default Row;
