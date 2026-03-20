import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";

const useGetSubAdminProfile = () => {
  const [data, setData] = useState({});
  const { sid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await axiosInstance.get(
          `api/admin/sub-admins/${sid}`
        );

        if (status === 200) {
          setData(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return data;
};

export default useGetSubAdminProfile;
