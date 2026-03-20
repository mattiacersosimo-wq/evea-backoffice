import { RHFSelect } from "src/components/hook-form";

import useDepartmentOptions from "../hooks/useDepartmentOptions";

const Departments = () => {
  const options = useDepartmentOptions();
  return (
    <RHFSelect name="department_id" label="help_center.form.department">
      <option value="" />
      {options}
    </RHFSelect>
  );
};

export default Departments;
