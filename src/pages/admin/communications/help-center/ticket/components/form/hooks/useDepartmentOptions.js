import useDepartmentList from "src/components/autoComplete/departments/hooks/useDepartmentList";

const useDepartmentOptions = () => {
  const departments = useDepartmentList();

  return departments.map(({ id, name }) => <option value={id}>{name}</option>);
};
export default useDepartmentOptions;
