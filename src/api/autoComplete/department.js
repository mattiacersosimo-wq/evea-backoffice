import axiosInstance from "src/utils/axios";

const departmentAutoComplete = async () => {
  try {
    const { data } = await axiosInstance.get(`/api/admin/department-list`);
    return data;
  } catch (err) {
    return err;
  }
};

export default departmentAutoComplete;
