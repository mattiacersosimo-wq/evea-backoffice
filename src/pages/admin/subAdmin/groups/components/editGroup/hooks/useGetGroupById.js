import { useEffect } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useGroupForm from "../../group/hooks/useGroupForm";

const useGetGroupById = () => {
  const { sid } = useParams();
  const methods = useGroupForm();
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const { status, data } = await axiosInstance.get(
          `/api/admin/sub-admin-user-groups/${id}`
        );
        if (status === 200) {
          const { name, description, sub_admin_group_permissions } = data.data;
          const menu =
            JSON.parse(
              sub_admin_group_permissions?.find(Boolean)?.permission_string ||
                "[]"
            )?.find(Boolean)?.items || [];
          methods.reset({
            name,
            description,
            menu,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (sid) {
      fetchData(sid);
    }
  }, [sid]);

  return methods;
};

export default useGetGroupById;
