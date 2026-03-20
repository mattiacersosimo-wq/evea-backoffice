import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import departmentAutoComplete from "src/api/autoComplete/department";

const useDepartmentList = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const fetchData = async () => {
    const { status, departments, message } = await departmentAutoComplete();
    if (status) {
      setDepartmentList(departments);
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return departmentList;
};

export default useDepartmentList;
